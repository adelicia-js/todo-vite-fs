import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import { SlTrash } from "react-icons/sl";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import { VscGithub } from "react-icons/vsc";
import { SiLinkedin } from "react-icons/si";
import Auth from "./components/Auth";
import { todoAPI } from "./services/api";
import type { Todo, User, AuthResponse } from "./types";

interface TodoInputProps {
  todo: string;
  setTodo: (value: string) => void;
  addTodo: () => void;
  todos: Todo[];
}

const TodoInputComponent: React.FC<TodoInputProps> = ({
  todo,
  setTodo,
  addTodo,
}) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  };

  return (
    <InputWrapper>
      <TodoInput
        type="text"
        value={todo}
        placeholder="Let's get workin'..."
        onChange={(e) => setTodo(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <AddButton onClick={addTodo}>
        <MdAdd size={21} />
      </AddButton>
    </InputWrapper>
  );
};

interface TodoListProps {
  todoList: Todo[];
  removeTodo: (todoId: string) => void;
  updateTodo: (todoId: string, newTitle: string) => void;
}

const TodoListComponent: React.FC<TodoListProps> = ({
  todoList,
  removeTodo,
  updateTodo,
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
        <TodoList>
          {todoList.map((todo) => (
            <TodoItem key={todo.id}>
              {editingId === todo.id ? (
                <>
                  <TodoEditInput
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                  <SaveButton onClick={saveEdit}>
                    <MdCheck size={18} />
                  </SaveButton>
                  <CancelButton onClick={cancelEdit}>
                    <MdClose size={18} />
                  </CancelButton>
                </>
              ) : (
                <>
                  <TodoText>{todo.title}</TodoText>
                  <EditButton onClick={() => startEdit(todo)}>
                    <MdEdit size={18} />
                  </EditButton>
                  <DeleteButton onClick={() => removeTodo(todo.id)}>
                    <SlTrash size={18} />
                  </DeleteButton>
                </>
              )}
            </TodoItem>
          ))}
        </TodoList>
      ) : (
        <EmptyState>
          <p>Add some tasks! :)</p>
        </EmptyState>
      )}
    </TodoListContainer>
  );
};

const FooterComponent: React.FC = () => {
  return (
    <Footer>
      <p>Made with 💖</p>
      <SocialsContainer>
        <a
          href="https://github.com/adelicia-js"
          rel="noreferrer"
          target="_blank"
        >
          <VscGithub size={25} />
        </a>
        <a
          href="https://www.linkedin.com/in/adelicia/"
          rel="noreferrer"
          target="_blank"
        >
          <SiLinkedin size={25} />
        </a>
      </SocialsContainer>
      <p>
        <SourceLink
          href="https://github.com/adelicia-js/todo-cra"
          rel="noreferrer"
          target="_blank"
        >
          $source | 2025 - 2026
        </SourceLink>
      </p>
    </Footer>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchTodos();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await todoAPI.getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (todo.trim() !== "") {
      try {
        const newTodo = await todoAPI.createTodo(todo.trim());
        setTodos([newTodo, ...todos]);
        setTodo("");
      } catch (error) {
        console.error("Failed to create todo:", error);
      }
    }
  };

  const updateTodo = async (todoId: string, newTitle: string) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(todoId, newTitle);
      setTodos(todos.map((t) => (t.id === todoId ? updatedTodo : t)));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await todoAPI.deleteTodo(todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleAuthSuccess = (authData: AuthResponse) => {
    setUser(authData.user);
    fetchTodos();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setTodos([]);
  };

  if (loading) {
    return (
      <AppContainer>
        <Title>Loading...</Title>
      </AppContainer>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <AppContainer>
      <Header>
        <Title>Make a To-Do List!</Title>
        <UserInfo>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <TodoInputComponent
          todo={todo}
          setTodo={setTodo}
          addTodo={addTodo}
          todos={todos}
        />
        <TodoListComponent
          todoList={todos}
          removeTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      </Content>
      <FooterComponent />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(
    185deg,
    #f79177 0%,
    #b88571 25%,
    #c68fce 50%,
    #da7ca3 75%,
    #b92a59 100%
  );
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow-x: hidden;
  font-family: "Space Mono", monospace;
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  width: 100%;

  @media screen and (min-width: 300px) and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  text-transform: uppercase;
  color: #310121;
  font-size: clamp(1.5rem, 4vw, 3rem);
  margin: 0;
  text-align: center;
`;

const UserInfo = styled.div`
  position: absolute;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #310121;
    font-size: 0.9rem;
    font-weight: 500;
  }

  @media screen and (min-width: 300px) and (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    justify-content: center;
  }

  @media screen and (min-width: 300px) and (max-width: 538px) {
    flex-direction: column;
    gap: 0.5rem;

    span {
      font-size: 0.8rem;
    }
  }
`;

const LogoutButton = styled.button`
  font-family: "Space Mono", monospace;
  background: #310121;
  color: white;
  border: 1px solid #310121;
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: white;
    color: #310121;
  }

  @media screen and (min-width: 300px) and (max-width: 538px) {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-radius: 7px 3px;
  width: clamp(30vw, 120vw, 50vw);
  margin: 0 auto;
  background: #31012150;
  box-shadow: 1px 0.1px 5px #31012194;

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 85vw;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 85vw;
  }
`;

const TodoInput = styled.input`
  font-family: "Space Mono", monospace;
  font-style: italic;
  border: 1px solid transparent;
  border-radius: 3px;
  width: calc(clamp(30vw, 120vw, 50vw) - 20%);
  background: #ffffffb0;
  font-size: clamp(0.5rem, 2rem, 1rem);
  padding: 0.3rem;
  box-shadow: 1px 0.1px 5px #ffffff71;

  &:focus {
    outline: 1px solid #310121;
    box-shadow: 1px 0.1px 5px #310121a1;
  }

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 67vw;
  }
`;

const ActionButton = styled.button`
  border: 1px solid white;
  border-radius: 30%;
  background: #3101218e;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffffa2;
    color: #310121;
    border: 1px solid #310121;
  }
`;

const AddButton = styled(ActionButton)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled(ActionButton)`
  font-size: clamp(0.1rem, 1rem, 0.7rem);
  padding: 0.5rem;
  height: auto;

  @media screen and (min-width: 300px) and (max-width: 450px) {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
`;

const EditButton = styled(ActionButton)`
  font-size: clamp(0.1rem, 1rem, 0.7rem);
  padding: 0.5rem;
  height: auto;
  background: #2d7d32;

  &:hover {
    background: #ffffffa2;
    color: #2d7d32;
    border: 1px solid #2d7d32;
  }

  @media screen and (min-width: 300px) and (max-width: 450px) {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
`;

const SaveButton = styled(ActionButton)`
  font-size: clamp(0.1rem, 1rem, 0.7rem);
  padding: 0.5rem;
  height: auto;
  background: #1976d2;

  &:hover {
    background: #ffffffa2;
    color: #1976d2;
    border: 1px solid #1976d2;
  }

  @media screen and (min-width: 300px) and (max-width: 450px) {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
`;

const CancelButton = styled(ActionButton)`
  font-size: clamp(0.1rem, 1rem, 0.7rem);
  padding: 0.5rem;
  height: auto;
  background: #d32f2f;

  &:hover {
    background: #ffffffa2;
    color: #d32f2f;
    border: 1px solid #d32f2f;
  }

  @media screen and (min-width: 300px) and (max-width: 450px) {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
`;

const TodoListContainer = styled.div`
  margin-top: -1rem;
`;

const TodoList = styled.ul`
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TodoItem = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
  overflow-wrap: anywhere;
  width: calc(clamp(30vw, 120vw, 50vw) - 45%);
  gap: 0.5rem;
  border-radius: 7px 7px;
  margin: 0 auto;
  padding: 0.3rem 0.5rem;

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 70vw;
    justify-content: flex-end;
  }
`;

const TodoText = styled.li`
  list-style-type: none;
  width: calc(clamp(30vw, 120vw, 50vw) - 45%);
  border-radius: 5px;
  font-size: clamp(0.3rem, 2rem, 1rem);
  background: #3101218e;
  color: white;
  border: 1px solid white;
  padding: 0.3rem 0.5rem;

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 50vw;
  }

  @media screen and (min-width: 300px) and (max-width: 450px) {
    width: 67vw;
  }
`;

const TodoEditInput = styled.input`
  font-family: "Space Mono", monospace;
  list-style-type: none;
  width: calc(clamp(30vw, 120vw, 50vw) - 45%);
  border-radius: 5px;
  font-size: clamp(0.3rem, 2rem, 1rem);
  background: #ffffffb0;
  color: #310121;
  border: 1px solid #310121;
  padding: 0.3rem 0.5rem;

  &:focus {
    outline: 1px solid #310121;
    box-shadow: 1px 0.1px 5px #310121a1;
  }

  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 50vw;
  }

  @media screen and (min-width: 300px) and (max-width: 450px) {
    width: 67vw;
  }
`;

const EmptyState = styled.div`
  padding: 2rem;

  p {
    color: #310121;
    font-size: 1.2rem;
    margin: 0;
  }
`;

const Footer = styled.footer`
  margin-top: 2rem;

  p {
    margin: 0.5rem 0;
    color: #310121;
  }
`;

const SocialsContainer = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.7rem;

  a {
    color: black;
    transition: all 0.2s ease;

    &:visited {
      color: black;
    }

    &:hover {
      color: #770f18;
      filter: drop-shadow(0 0 0.15rem #947779c9);
    }
  }
`;

const SourceLink = styled.a`
  text-decoration: none;
  color: black;

  &:visited {
    color: black;
  }

  &:hover {
    color: #770f37;
    text-decoration: underline;
    text-underline-offset: 0.4rem;
  }
`;

export default App;
