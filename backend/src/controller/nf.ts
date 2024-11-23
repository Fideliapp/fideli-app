import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nf, valor, empresaId, } = req.body;

    const newNf = await prisma.notaFiscal.create({
      data: {
        data: new Date(),
        nf,
        valor,
        empresaId: parseInt(empresaId),
      }
    })

    res.status(201).json(newNf);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};