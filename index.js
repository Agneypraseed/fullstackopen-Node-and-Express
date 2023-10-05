require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("postbody", function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postbody"
  )
);

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

app.get("/", (req, res) => {
  res.redirect("/api/persons");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((res) => response.json(res));
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

const generateId = () => {
  const maxId = Math.max(...phonebook.map((person) => person.id), 1);
  let id;

  do {
    id = Math.floor(Math.random() * 1001);
  } while (phonebook.find((person) => person.id === id));

  return id > maxId ? id : maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }

  Person.find({ name: body.name }).then((result) => {    
    if (result.length != 0) {
      res.status(400).json({
        error: "name must be unique",
      });
    } else {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      });

      newPerson.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    }
  });
});

app.get("/info", (request, response) => {
  const info = `
                <p>Phonebook has info for ${phonebook.length} people</p>
                <p>${new Date()}</p>
                `;
  response.send(info);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Endpoint does not exist" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
