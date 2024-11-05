import { Request, Response } from 'express';
import prisma from '../architecture/prisma';
import { Prisma } from '@prisma/client';

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

      let acumulado = await client.pontos.findUnique({
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

      if (!acumulado) acumulado = { valorAcumulado: 0, pontos: 0 };

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

      await createTransaction(clienteId, valor, cartaoId, empresaId, client);
    });

    res.status(201).json({ message: "Compra cadastrada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar a compra.", error });
  }
};

export const getByUser = async (req: Request, res: Response): Promise<void> => {
  const { clienteId } = req.params

  try {
    const pontos = await prisma.pontos.findMany({
      where: { clienteId: Number(clienteId) },
      select: {
        id: true,
        pontos: true,
        valorAcumulado: true,
        empresa: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    res.status(200).json(pontos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar pontos do usuário." });
  }
}

const createTransaction = async (clienteId: number, valor: number, cartaoId: number, empresaId: number, client: Prisma.TransactionClient = prisma) => {
  return client.transacoes.create({
    data: {
      clienteId,
      valor,
      cartaoId,
      empresaId,
      data: new Date()
    }
  })
}

export const getPointsEnterpriseChart = async (req: Request, res: Response): Promise<void> => {
  const { clienteId } = req.params
  try {
    const pontos = await prisma.pontos.findMany({
      select: {
        pontos: true,
        empresa: {
          select: { nome: true, id: true }
        }
      },
      where: { clienteId: Number(clienteId) }
    })

    if (!pontos) return

    const formattedResponse = pontos.map(({ empresa, pontos }) => ({
      ...empresa,
      pontos
    }))

    res.status(200).json(formattedResponse)

  } catch (error) {

  }
}