const express = require('express');
const app = express();
app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];


let nextId = 3;


app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});


app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(200).json(todo);
});


app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required and must be a non-empty string.' });
  }

  const newTodo = {
    id: nextId++, 
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  const { task, completed } = req.body;

  
  if (task !== undefined && typeof task === 'string' && task.trim() !== '') {
    todo.task = task.trim();
  }
  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  res.status(200).json(todo);
});


app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send();
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));