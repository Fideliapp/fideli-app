import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const { clienteId, empresaId, nome, numero } = req.body;

    const newCard = await prisma.cartao.create({
      data: {
        nome,
        numero,
        clienteId: parseInt(clienteId),
        empresaId: parseInt(empresaId)
      }
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getByUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;

  try {
    const cards = await prisma.cartao.findMany({
      include: {
        empresa: true
      },
      where: {
        clienteId: parseInt(userId)
      }
    });
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const card = await prisma.cartao.findUnique({
      where: { id: parseInt(id) }
    });

    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: "Card not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
