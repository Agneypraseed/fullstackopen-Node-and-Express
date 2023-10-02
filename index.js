const express = require("express");
const app = express();

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "Invalid Id" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    phonebook = phonebook.filter((person) => person.id !== id);
    res.status(204).end();
  } else {
    res
      .status(404)
      .json({ error: "Person has already been deleted or Invalid id" });
  }
});

app.get("/info", (request, response) => {
  const info = `
                <p>Phonebook has info for ${phonebook.length} people</p>
                <p>${new Date()}</p>
                `;
  response.send(info);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
