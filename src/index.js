const express = require('express');

const app = express();
app.use(express.json());

const users = [];
const cards = [];
const enterprises = [];

app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  const userExists = users.find(u => u.user === user && u.pass === pass);

  if (userExists) {
    res.json({ message: "Authorized" });
  } else {
    res.json({ message: "Unauthorized" });
  }
});

app.post('/register', (req, res) => {
  const { user, pass } = req.body;

  const userExists = users.find(u => u.user === user);

  if (userExists) {
    res.json({ message: "User already exists" });
    return;
  }

  users.push({ user, pass });
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/enterprise", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Enterprise name is required" });
  }

  const enterpriseExists = enterprises.find(c => c.name === name);

  if (enterpriseExists) {
    return res.status(400).json({ message: "Enterprise already exists" });
  }

  const newEnterprise = { id: enterprises.length + 1, name };
  enterprises.push(newEnterprise);
  res.status(201).json(newEnterprise);
});

app.get('/enterprise/:id', (req, res) => {
  const { id } = req.params;
  const enterprise = enterprises.find(c => c.id === parseInt(id));

  if (enterprise) {
    res.json(enterprise);
  } else {
    res.status(404).json({ message: "Enterprise not found" });
  }
});

app.post("/cards", (req, res) => {
  const { user, enterpriseId } = req.body;

  const userExists = users.find(u => u.user === user);
  const enterpriseExists = enterprises.find(c => c.id === parseInt(enterpriseId));

  if (!userExists) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (!enterpriseExists) {
    return res.status(400).json({ message: "Enterprise does not exist" });
  }

  const newCard = { id: cards.length + 1, user, enterpriseId };
  cards.push(newCard);
  res.status(201).json(newCard);
});

app.get("/cards", (req, res) => {
  res.status(200).json(cards);
});

app.get("/cards/:id", (req, res) => {
  const { id } = req.params;
  const card = cards.find(c => c.id === parseInt(id));

  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});