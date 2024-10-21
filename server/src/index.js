const express = require('express');
const prisma = require('./service/prisma');
const cors = require('cors');
const jwt = require("jsonwebtoken")

const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fideliapp';

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Você não está autenticado.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalido' });
    req.user = user;
    next();
  });
};

app.post("/login", async (req, res) => {
  try {
    const { cpf, pass } = req.body;

    const cliente = await prisma.client.findUnique({
      where: { CPF: cpf }
    });

    if (!cliente) return res.status(401).send({ message: "Usuário ou senha inválidos" });

    const validPassword = pass === cliente.senha
    if (!validPassword) return res.status(401).send({ message: "Usuário ou senha inválidos" });

    const token = jwt.sign({ id: cliente.id, cpf: cliente.CPF }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: "Autenticado com sucesso", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { pass, cpf, tel, email } = req.body;

    const existsCpf = await prisma.client.findUnique({ where: { CPF: cpf } })

    if (existsCpf) return res.status(400).json({ message: "CPF já está em uso." });

    await prisma.client.create({
      data: {
        email,
        senha: pass,
        CPF: cpf,
        tel,
      }
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use(authenticateToken)

app.post("/enterprise", async (req, res) => {
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
});

app.get('/enterprise/:id', async (req, res) => {
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
});

app.get('/enterprise', async (req, res) => {
  try {
    const enterprises = await prisma.empresa.findMany({
      include: {
        Promocoes: true,
        ramo: true
      }
    });
    res.status(200).json(enterprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.post("/cards", async (req, res) => {
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
});

app.get("/cards/:userId", async (req, res) => {
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
});

app.get("/cards/:id", async (req, res) => {
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
});

app.use((err, _, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });

  next()
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
