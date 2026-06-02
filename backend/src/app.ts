import express from 'express';
import cors from 'cors';
import { todosRouter } from './todos.router';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/todos', todosRouter);
