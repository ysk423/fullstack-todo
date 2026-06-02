import request from 'supertest';
import { app } from '../app';
import { resetDb } from '../db';

beforeEach(() => {
  resetDb();
});

describe('Todos API', () => {
  describe('GET /api/todos', () => {
    it('returns empty array initially', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/todos', () => {
    it('creates a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Buy groceries' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        title: 'Buy groceries',
        completed: false,
      });
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/api/todos').send({});
      expect(res.status).toBe(400);
    });

    it('returns 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates a todo title', async () => {
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'Original' });
      const id = created.body.id;

      const res = await request(app)
        .put(`/api/todos/${id}`)
        .send({ title: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('toggles completed status', async () => {
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'Task' });
      const id = created.body.id;

      const res = await request(app)
        .put(`/api/todos/${id}`)
        .send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for non-existent id', async () => {
      const res = await request(app)
        .put('/api/todos/99999')
        .send({ title: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo', async () => {
      const created = await request(app)
        .post('/api/todos')
        .send({ title: 'To delete' });
      const id = created.body.id;

      const res = await request(app).delete(`/api/todos/${id}`);
      expect(res.status).toBe(204);

      const list = await request(app).get('/api/todos');
      expect(list.body.find((t: { id: number }) => t.id === id)).toBeUndefined();
    });

    it('returns 404 for non-existent id', async () => {
      const res = await request(app).delete('/api/todos/99999');
      expect(res.status).toBe(404);
    });
  });
});
