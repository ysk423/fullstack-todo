import { Router, Request, Response } from 'express';
import { getDb } from './db';

export const todosRouter = Router();

interface TodoRow {
  id: number;
  title: string;
  completed: number;
}

function toTodo(row: TodoRow) {
  return { id: row.id, title: row.title, completed: row.completed === 1 };
}

todosRouter.get('/', (_req: Request, res: Response) => {
  const rows = getDb().prepare('SELECT * FROM todos ORDER BY id').all() as unknown as TodoRow[];
  res.json(rows.map(toTodo));
});

todosRouter.post('/', (req: Request, res: Response) => {
  const { title } = req.body as { title?: string };
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const result = getDb().prepare('INSERT INTO todos (title) VALUES (?)').run(title.trim());
  const row = getDb()
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(result.lastInsertRowid) as unknown as TodoRow;
  res.status(201).json(toTodo(row));
});

todosRouter.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = getDb().prepare('SELECT * FROM todos WHERE id = ?').get(id) as unknown as TodoRow | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const { title, completed } = req.body as { title?: string; completed?: boolean };
  const newTitle = title !== undefined ? title : existing.title;
  const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
  getDb()
    .prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?')
    .run(newTitle, newCompleted, id);
  const updated = getDb().prepare('SELECT * FROM todos WHERE id = ?').get(id) as unknown as TodoRow;
  res.json(toTodo(updated));
});

todosRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = getDb().prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(204).end();
});
