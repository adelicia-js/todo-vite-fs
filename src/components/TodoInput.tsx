import styled from "styled-components";
import type { Todo } from "../types";

interface TodoInputProps {
  todo: string;
  setTodo: (value: string) => void;
  addTodo: () => void;
  todos: Todo[];
}

const TodoInput: React.FC<TodoInputProps> = ({ todo, setTodo, addTodo }) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  };

  return (
    <InputWrapper>
      <Input
        type="text"
        value={todo}
        placeholder="What needs to be done today?"
        onChange={(e) => setTodo(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <AddButton onClick={addTodo}>+</AddButton>
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  margin-bottom: 30px;
  position: relative;
`;

const Input = styled.input`
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text y='20' font-size='20'>🖋️</text></svg>")
      12 12,
    auto;
  width: 100%;
  border: none;
  background: transparent;
  font-family: "Kalam", cursive;
  font-size: 1.1rem;
  color: #1e40af;
  padding: 10px 45px 10px 0;
  border-bottom: 1px dotted #9ca3af;
  outline: none;
  transition: border-bottom-color 0.2s ease;

  &::placeholder {
    color: #9ca3af;
    font-style: italic;
  }

  &:focus {
    border-bottom-color: #1e40af;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 8px 40px 8px 0;
  }

  @media (max-width: 360px) {
    font-size: 0.95rem;
    padding: 6px 35px 6px 0;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 2px solid #1e40af;
  color: #1e40af;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: "Kalam", cursive;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #1e40af;
    color: white;
    transform: translateY(-50%) rotate(90deg);
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }

  @media (max-width: 360px) {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
`;

export default TodoInput;
