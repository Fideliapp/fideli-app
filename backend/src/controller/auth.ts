import { Request, Response } from 'express';
import prisma from '../architecture/prisma';
import { sign } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { isValidDocument } from '../utils/string';

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cpf, pass } = req.body;

    const client = await prisma.client.findUnique({
      where: { CPF: cpf }
    });

    if (!client) return res.status(401).send({ message: "Usuário ou senha inválidos" });

    const validPassword = await bcrypt.compare(pass, client.senha);
    if (!validPassword) return res.status(401).send({ message: "Usuário ou senha inválidos" });

    const token = sign(client.id, cpf);

    res.status(200).json({ message: "Autenticado com sucesso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pass, cpf, tel, email } = req.body;

    if (!isValidDocument(cpf)) return res.status(400).json({ message: "CPF inválido" });

    const existsCpf = await prisma.client.findUnique({ where: { CPF: cpf } });

    if (existsCpf) return res.status(400).json({ message: "CPF já está em uso." });

    const hashedPassword = await bcrypt.hash(pass, 10);

    await prisma.client.create({
      data: {
        email,
        senha: hashedPassword,
        CPF: cpf,
        tel,
      }
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
