import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { cartaoId, valor, clienteId, empresaId },
    } = req;

    console.log({
      cartaoId,
      valor,
      clienteId,
      empresaId,
    });

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

      await client.pontos.upsert({
        where: {
          clienteId_empresaId: {
            clienteId,
            empresaId,
          },
        },
        update: {
          pontos: {
            increment: pontosAcumulados,
          },
        },
        create: {
          clienteId,
          empresaId,
          pontos: pontosAcumulados,
        },
      });
    });

    res.status(201).json({ message: "Compra cadastrada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar a compra." });
  }
};
