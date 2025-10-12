// server.js
const express = require('express');
const app = express();
app.use(express.json());

let todos = [];

app.get('/', (req, res) => res.send('Node.js To-Do App running'));
app.get('/todos', (req, res) => res.json(todos));
app.post('/todos', (req, res) => {
  const todo = { id: todos.length + 1, task: req.body.task || 'task' };
  todos.push(todo);
  res.status(201).json(todo);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`App listening on ${port}`));
