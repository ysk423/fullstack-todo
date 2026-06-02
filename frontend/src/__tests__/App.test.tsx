import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeFetchResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('App', () => {
  it('shows empty state when no todos exist', async () => {
    mockFetch.mockReturnValueOnce(makeFetchResponse([]));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/todo がありません/i)).toBeInTheDocument();
    });
  });

  it('displays fetched todos', async () => {
    mockFetch.mockReturnValueOnce(
      makeFetchResponse([
        { id: 1, title: 'Buy milk', completed: false },
        { id: 2, title: 'Walk dog', completed: true },
      ])
    );
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.getByText('Walk dog')).toBeInTheDocument();
    });
  });

  it('adds a new todo when form is submitted', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockReturnValueOnce(makeFetchResponse([]))
      .mockReturnValueOnce(
        makeFetchResponse({ id: 1, title: 'New Task', completed: false }, 201)
      )
      .mockReturnValueOnce(
        makeFetchResponse([{ id: 1, title: 'New Task', completed: false }])
      );

    render(<App />);
    await waitFor(() => screen.getByText(/todo がありません/i));

    const input = screen.getByPlaceholderText(/新しい todo/i);
    const button = screen.getByRole('button', { name: /追加/i });

    await user.type(input, 'New Task');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('does not add a todo when input is empty', async () => {
    const user = userEvent.setup();
    mockFetch.mockReturnValueOnce(makeFetchResponse([]));

    render(<App />);
    await waitFor(() => screen.getByText(/todo がありません/i));

    const button = screen.getByRole('button', { name: /追加/i });
    await user.click(button);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('toggles todo completion', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse([{ id: 1, title: 'Buy milk', completed: false }])
      )
      .mockReturnValueOnce(
        makeFetchResponse({ id: 1, title: 'Buy milk', completed: true })
      )
      .mockReturnValueOnce(
        makeFetchResponse([{ id: 1, title: 'Buy milk', completed: true }])
      );

    render(<App />);
    await waitFor(() => screen.getByText('Buy milk'));

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse([{ id: 1, title: 'Buy milk', completed: false }])
      )
      .mockReturnValueOnce(makeFetchResponse(null, 204))
      .mockReturnValueOnce(makeFetchResponse([]));

    render(<App />);
    await waitFor(() => screen.getByText('Buy milk'));

    const deleteBtn = screen.getByRole('button', { name: /削除/i });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    });
  });
});
