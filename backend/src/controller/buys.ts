import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { cartaoId, valor, clienteId, empresaId },
    } = req;

    const pontosAcumulados = Math.floor(valor / 10);

    await prisma.$transaction(async (client) => {
      await client.compras.create({
        data: {
          cartaoId,
          valor,
          clienteId,
          data: new Date(),
        },
      });

      const acumulado = await client.pontos.findUniqueOrThrow({
        where: {
          clienteId_empresaId: {
            clienteId,
            empresaId,
          },
        },
        select: {
          valorAcumulado: true,
          pontos: true,
        },
      });

      await client.pontos.upsert({
        where: {
          clienteId_empresaId: {
            clienteId,
            empresaId,
          },
        },
        update: {
          valorAcumulado: {
            increment: valor,
          },
          pontos: {
            increment: Math.floor((acumulado?.valorAcumulado + valor) / 10) - Math.floor(acumulado?.valorAcumulado / 10),
          },
        },
        create: {
          clienteId,
          empresaId,
          pontos: pontosAcumulados,
          valorAcumulado: valor,
        },
      });
    });

    res.status(201).json({ message: "Compra cadastrada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar a compra." });
  }
};
