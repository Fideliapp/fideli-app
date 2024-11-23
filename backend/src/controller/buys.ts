import { Request, Response } from 'express';
import prisma from '../architecture/prisma';
import { Prisma } from '@prisma/client';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      body: { cartaoId, clienteId, nf },
    } = req;

    if (!cartaoId || !nf || !clienteId) {
      res.status(400).json({ message: "Todos os campos são obrigatórios." });
      return;
    }

    await prisma.$transaction(async (client) => {
      const nota = await client.notaFiscal.findUnique({
        select: {
          id: true,
          valor: true,
          empresaId: true,
        },
        where: {
          nf,
        },
      });

      if (!nota) {
        throw new Error("NOTA_NOT_FOUND");
      }

      const valor = nota.valor;
      const pontosAcumulados = Math.floor(valor / 10);

      const compra = await client.compras.create({
        data: {
          cartaoId,
          valor,
          notaId: nota.id,
          clienteId,
          data: new Date(),
        },
      });

      await client.notaFiscal.update({
        where: {
          id: nota.id,
        },
        data: {
          compraId: compra.id,
        },
      });

      let acumulado = await client.pontos.findUnique({
        where: {
          clienteId_empresaId: {
            clienteId,
            empresaId: nota.empresaId,
          },
        },
        select: {
          valorAcumulado: true,
          pontos: true,
        },
      });

      if (!acumulado) acumulado = { valorAcumulado: 0, pontos: 0 };

      const points =
        Math.floor((acumulado?.valorAcumulado + valor) / 10) -
        Math.floor(acumulado?.valorAcumulado / 10);

      await client.pontos.upsert({
        where: {
          clienteId_empresaId: {
            clienteId,
            empresaId: nota.empresaId,
          },
        },
        update: {
          valorAcumulado: {
            increment: valor,
          },
          pontos: {
            increment: points,
          },
        },
        create: {
          clienteId,
          empresaId: nota.empresaId,
          pontos: pontosAcumulados,
          valorAcumulado: valor,
        },
      });

      await createTransaction(
        clienteId,
        valor,
        cartaoId,
        nota.empresaId,
        client
      );
    });

    res.status(201).json({ message: "Compra cadastrada com sucesso!" });
  } catch (error) {
    if (error instanceof Error && error.message === "NOTA_NOT_FOUND") {
      res.status(404).json({ message: "Nota fiscal não encontrada." });
    } else {
      console.error("Error buys.ts: ", error);
      res.status(500).json({ message: "Erro ao cadastrar a compra.", error });
    }
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
  const { clienteId } = req.params;

  try {
    const pontos = await prisma.pontos.findMany({
      select: {
        pontos: true,
        empresa: {
          select: { nome: true, id: true },
        },
      },
      where: { clienteId: Number(clienteId) },
    });

    if (!pontos || pontos.length === 0) {
      res.status(404).json({ message: "Nenhum ponto encontrado para este cliente." });
      return;
    }

    const formattedResponse = pontos.map(({ empresa, pontos }) => ({
      ...empresa,
      pontos,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching enterprise chart:", error);
    res.status(500).send({
      message: "Ops, Algo deu errado",
      error,
    });
  }
};

export const getUserPointsHistory = async (req: Request, res: Response): Promise<void> => {
  const { clienteId } = req.params;

  try {
    const totalGastoRaw = await prisma.$queryRaw`
      SELECT DATE(data) as data, SUM(valor) as total
      FROM Transacoes
      WHERE clienteId = ${Number(clienteId)}
      GROUP BY DATE(data)
    `;

    const totalGasto = (totalGastoRaw as { data: Date; total: number }[]).map(
      (item: { data: Date; total: number }) => ({
        data: item.data,
        _sum: { valor: item.total },
      })
    );

    if (!totalGasto || totalGasto.length === 0) {
      res.status(404).json({
        message: "Nenhum histórico encontrado para este cliente.",
      });
      return;
    }

    const result = totalGasto.map((item) => ({
      data: item.data,
      total: item._sum.valor,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching points history:", error);
    res.status(500).json({
      message: "Ops, algo deu errado.",
      error,
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