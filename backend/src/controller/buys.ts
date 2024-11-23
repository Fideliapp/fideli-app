import { Request, Response } from 'express';
import prisma from '../architecture/prisma';
import { Prisma } from '@prisma/client';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { cartaoId, clienteId, empresaId, nf },
    } = req;

    if (!cartaoId || !nf || !clienteId || !empresaId) {
      res.status(400).json({ message: "Todos os campos são obrigatórios." });
      return;
    }

    await prisma.$transaction(async (client) => {
      const nota = await client.notaFiscal.findUniqueOrThrow({
        select: {
          id: true,
          valor: true,
        },
        where: {
          nf,
        },
      })

      if (!nota) {
        res.status(404).json({ message: "Nota fiscal não encontrada." });
        return;
      }

      const valor = nota.valor;

      const pontosAcumulados = Math.floor(valor / 10);

      await client.compras.create({
        data: {
          cartaoId,
          valor,
          notaId: nota.id,
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

      const points = Math.floor((acumulado?.valorAcumulado + valor) / 10) - Math.floor(acumulado?.valorAcumulado / 10)

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
            increment: points
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
    console.error("Error buys.ts: ", error);
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
    res.status(400).send({
      message: "Ops, Algo deu errado",
      error
    })
  }
}

export const getUserPointsHistory = async (req: Request, res: Response): Promise<void> => {
  const { clienteId } = req.params;

  try {
    const totalGastoRaw = await prisma.$queryRaw`
      SELECT DATE(data) as data, SUM(valor) as total
      FROM Transacoes
      WHERE clienteId = ${Number(clienteId)}
      GROUP BY DATE(data)
    `;

    const totalGasto = (totalGastoRaw as { data: Date, total: number }[]).map((item: { data: Date, total: number }) => ({
      data: item.data,
      _sum: { valor: item.total }
    }));

    if (!totalGasto || totalGasto.length === 0) {
      res.status(404).json({ message: "Nenhum histórico encontrado para este cliente." });
    }

    const result = totalGasto.map(item => ({
      data: item.data,
      total: item._sum.valor,
    }));

    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({
      message: "Ops, algo deu errado.",
      error
    });
  }
};

export const getResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = prisma.empresa.findMany({
      select: {
        id: true,
        nome: true,
        _count: {
          select: {
            Pontos: true,
          }
        }
      },
    })

    res.status(200).json(resume)

  } catch (error) {
    res.status(400).json({
      message: "Ops, algo deu errado.",
      error
    });
  }
}