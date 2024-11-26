import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nf, valor, empresaId, clienteId } = req.body;

    const newNf = await prisma.notaFiscal.create({
      data: {
        data: new Date(),
        nf,
        valor: parseFloat(valor),
        empresaId: parseInt(empresaId),
        clienteId: parseInt(clienteId),
      }
    })

    res.status(201).json(newNf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getByEnterprise = async (req: Request, res: Response): Promise<any> => {
  const { empresaId } = req.params;

  try {
    const nfs = await prisma.notaFiscal.findMany({
      where: {
        empresaId: parseInt(empresaId),
      }
    });

    res.status(200).json(nfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};