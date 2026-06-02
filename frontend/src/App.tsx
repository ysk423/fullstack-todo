import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const API = '/api/todos';

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(API);
  return res.json();
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const reload = () => fetchTodos().then(setTodos);

  useEffect(() => {
    reload();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input.trim() }),
    });
    setInput('');
    await reload();
  };

  const toggleTodo = async (todo: Todo) => {
    await fetch(`${API}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    await reload();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await reload();
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="新しい Todo を入力"
          style={{ flex: 1, padding: '6px 10px', fontSize: 16 }}
        />
        <button onClick={addTodo} style={{ padding: '6px 16px' }}>
          追加
        </button>
      </div>

      {todos.length === 0 ? (
        <p style={{ color: '#888' }}>Todo がありません</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#aaa' : 'inherit',
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="削除"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
