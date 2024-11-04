import { Request, Response } from 'express';
import prisma from '../architecture/prisma';

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cnpj, ...data } = req.body;

    const cnpjExists = await prisma.empresa.findUnique({ where: { cnpj } });

    if (cnpjExists) {
      return res.status(400).json({ message: "CNPJ já está em uso." });
    }

    const newEnterprise = await prisma.empresa.create({
      data: { cnpj, ...data }
    });

    res.status(201).json(newEnterprise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const enterprise = await prisma.empresa.findUnique({
      where: { id: parseInt(id) }
    });

    if (enterprise) {
      res.json(enterprise);
    } else {
      res.status(404).json({ message: "Enterprise not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const get = async (req: Request, res: Response): Promise<any> => {
  try {
    const enterprises = await prisma.empresa.findMany({
      include: {
        Promocoes: true,
      }
    });
    res.status(200).json(enterprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
