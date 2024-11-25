import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nome, descricao, valor, data, empresaId } = req.body;

    const dataFormatted = data ? new Date(data) : new Date();

    const newPromotion = await prisma.promocoes.create({
      data: {
        nome,
        descricao,
        valor: parseInt(valor),
        data: new Date(dataFormatted),
        empresaId: parseInt(empresaId)
      }
    });

    res.status(201).json(newPromotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno do Servidor" });
  }
};

export const getByEmpresa = async (req: Request, res: Response): Promise<any> => {
  const { empresaId } = req.params;

  try {
    const promotions = await prisma.promocoes.findMany({
      where: {
        empresaId: parseInt(empresaId)
      }
    });

    res.status(200).json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno do Servidor" });
  }
};

export const buy = async (req: Request, res: Response): Promise<any> => {
  const { clienteId, promocaoId } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const promocao = await tx.promocoes.findUnique({
        where: { id: promocaoId },
      });

      if (!promocao) {
        throw new Error("Promoção não encontrada");
      }

      const user = await tx.pontos.findUnique({
        where: { clienteId_empresaId: { clienteId, empresaId: promocao.empresaId } },
      });

      if (!user) {
        throw new Error("Pontos não encontrados");
      }

      if (user.pontos < promocao.valor) {
        throw new Error("Pontos insuficientes");
      }

      const updatedUser = await tx.pontos.update({
        where: { clienteId_empresaId: { clienteId, empresaId: promocao.empresaId } },
        data: { pontos: user.pontos - promocao.valor },
      });

      return {
        promocao: promocao.nome,
        pontosRestantes: updatedUser.pontos,
      };
    });

    res.status(200).json({ message: "Promoção consumida com sucesso", ...result });
  } catch (error: any) {
    console.error(error);

    // Trata erros conhecidos.
    if (error.message === "Promoção não encontrada" || error.message === "Pontos não encontrados") {
      return res.status(404).json({ message: error.message });
    } else if (error.message === "Pontos insuficientes") {
      return res.status(400).json({ message: error.message });
    }

    // Erros genéricos.
    res.status(500).json({ message: "Erro Interno do Servidor" });
  }
};
