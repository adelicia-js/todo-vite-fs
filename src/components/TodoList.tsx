import { useState } from "react";
import styled from "styled-components";
import type { Todo } from "../types";

interface TodoListProps {
  todoList: Todo[];
  removeTodo: (todoId: string) => void;
  updateTodo: (todoId: string, newTitle: string) => void;
  toggleComplete: (todoId: string, completed: boolean) => void;
  deletingId: string | null;
}

const TodoList: React.FC<TodoListProps> = ({
  todoList,
  removeTodo,
  updateTodo,
  toggleComplete,
  deletingId,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = () => {
    if (editingId && editText.trim() !== "") {
      updateTodo(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <TodoListContainer>
      {todoList?.length > 0 ? (
        <List>
          {todoList.map((todo) => (
            <TodoItem key={todo.id} $isDeleting={deletingId === todo.id}>
              {editingId === todo.id ? (
                <>
                  <TodoEditInput
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                  <TaskActions>
                    <SaveButton onClick={saveEdit}>✓</SaveButton>
                    <CancelButton onClick={cancelEdit}>✕</CancelButton>
                  </TaskActions>
                </>
              ) : (
                <>
                  <TaskCheckbox 
                    $completed={todo.completed}
                    onClick={() => toggleComplete(todo.id, !todo.completed)}
                    title={todo.completed ? "Mark incomplete" : "Mark complete"}
                  />
                  <TodoText $completed={todo.completed}>{todo.title}</TodoText>
                  <TaskActions>
                    <EditButton 
                      onClick={() => startEdit(todo)}
                      disabled={deletingId === todo.id}
                    >
                      ✏️
                    </EditButton>
                    <DeleteButton 
                      onClick={() => removeTodo(todo.id)}
                      disabled={deletingId === todo.id}
                    >
                      {deletingId === todo.id ? "⏳" : "🗑️"}
                    </DeleteButton>
                  </TaskActions>
                </>
              )}
            </TodoItem>
          ))}
        </List>
      ) : (
        <EmptyState>
          <p>No tasks yet. Start writing!</p>
        </EmptyState>
      )}
    </TodoListContainer>
  );
};

const TodoListContainer = styled.div``;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TodoItem = styled.li<{ $isDeleting: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px 0;
  position: relative;
  transform: rotate(-0.2deg);
  opacity: ${props => props.$isDeleting ? 0.5 : 1};
  transition: opacity 0.2s ease;
  min-height: 44px; /* Better touch target */

  &:nth-child(even) {
    transform: rotate(0.3deg);
  }

  &:nth-child(3n) {
    transform: rotate(-0.1deg);
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
    padding: 6px 0;
  }
`;

const TaskCheckbox = styled.div<{ $completed: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid #1e40af;
  border-radius: 3px;
  margin-right: 15px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  background: ${props => props.$completed ? '#1e40af' : 'transparent'};
  transform: rotate(-2deg);
  transition: all 0.2s ease;
  min-width: 20px; /* Prevent shrinking */

  ${props => props.$completed && `
    &::after {
      content: '✓';
      position: absolute;
      top: -3px;
      left: 2px;
      color: white;
      font-size: 16px;
      font-weight: bold;
    }
  `}

  @media (max-width: 480px) {
    margin-right: 12px;
  }
`;

const TodoText = styled.span<{ $completed: boolean }>`
  font-size: 1.1rem;
  color: ${props => props.$completed ? '#9ca3af' : '#374151'};
  flex-grow: 1;
  line-height: 1.4;
  font-family: 'Kalam', cursive;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  text-decoration-color: #dc2626;
  text-decoration-thickness: 2px;
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.3;
  }

  @media (max-width: 360px) {
    font-size: 0.95rem;
  }
`;

const TodoEditInput = styled.input`
  font-size: 1.1rem;
  color: #374151;
  flex-grow: 1;
  line-height: 1.4;
  font-family: 'Kalam', cursive;
  border: none;
  background: rgba(30, 64, 175, 0.05);
  padding: 4px 8px;
  border-radius: 3px;
  border-bottom: 1px dotted #1e40af;
  outline: none;

  &:focus {
    background: rgba(30, 64, 175, 0.1);
    border-bottom-color: #1e40af;
  }
`;

const TaskActions = styled.div`
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 8px;

  ${TodoItem}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    /* Always show on mobile for better touch access */
    opacity: 0.7;
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-left: 6px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 3px;
  transition: all 0.2s ease;
  line-height: 1;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    min-width: 28px;
    min-height: 28px;
    padding: 2px;
  }
`;

const EditButton = styled(ActionButton)`
  &:hover:not(:disabled) {
    color: #1e40af;
    background: rgba(30, 64, 175, 0.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover:not(:disabled) {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }
`;

const SaveButton = styled(ActionButton)`
  color: #16a34a;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    color: #15803d;
    background: rgba(22, 163, 74, 0.1);
  }
`;

const CancelButton = styled(ActionButton)`
  color: #dc2626;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    color: #b91c1c;
    background: rgba(220, 38, 38, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-style: italic;
  font-family: 'Kalam', cursive;

  &::before {
    content: '📝';
    display: block;
    font-size: 3rem;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }

  @media (max-width: 480px) {
    padding: 30px 15px;

    &::before {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    p {
      font-size: 1rem;
    }
  }
`;

export default TodoList;