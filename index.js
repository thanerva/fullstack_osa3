const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :body"));
app.use(express.json());
app.use(cors());
let persons = [
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
    number: "12-43-234234",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
  console.log(persons.length);
});

app.get("/api/info", (req, res) => {
  const length = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${length} people<br> ${date}</p>`);
  console.log(date);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter((person) => person.id !== id);
  console.log("this happened");
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  /* console.log(body); */

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (
    persons
      .map((person) => person.name.toLocaleLowerCase())
      .includes(body.name.toLocaleLowerCase())
  ) {
    return res.status(400).json({
      error: "the name was already found in the database",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  /*   console.log(person); */
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
