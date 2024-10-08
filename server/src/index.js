const express = require('express');
const prisma = require('./service/prisma');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;

    const userExists = await prisma.client.findUnique({
      where: { email: user, senha: pass }
    });

    if (userExists) {
      res.json({ message: "Authorized" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { pass, cpf, tel, email } = req.body;

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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/enterprise", async (req, res) => {
  try {
    const { ...data } = req.body;

    const newEnterprise = await prisma.empresa.create({
      data
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

app.post("/cards", async (req, res) => {
  try {
    const { ...data } = req.body;

    const newCard = await prisma.cartao.create({
      data
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/cards", async (req, res) => {
  try {
    const cards = await prisma.cartao.findMany();
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
