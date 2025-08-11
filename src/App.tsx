import { useState } from 'react'
import styled from 'styled-components'
import { MdAdd } from 'react-icons/md'
import { SlTrash } from 'react-icons/sl'
import { VscGithub } from 'react-icons/vsc'
import { SiLinkedin } from 'react-icons/si'

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
  font-family: 'Space Mono', monospace;
  padding: 2rem 0;
`

const Title = styled.h1`
  text-transform: uppercase;
  color: #310121;
  font-size: clamp(1.5rem, 4vw, 3rem);
  margin-bottom: 2rem;
`

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
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  
  @media screen and (min-width: 300px) and (max-width: 538px) {
    width: 85vw;
  }
`

const TodoInput = styled.input`
  font-family: 'Space Mono', monospace;
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
`

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
`

const AddButton = styled(ActionButton)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DeleteButton = styled(ActionButton)`
  font-size: clamp(0.1rem, 1rem, 0.7rem);
  padding: 0.5rem;
  height: auto;
  
  @media screen and (min-width: 300px) and (max-width: 450px) {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
`

const TodoListContainer = styled.div`
  margin-top: -1rem;
`

const TodoList = styled.ul`
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

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
`

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
`

const EmptyState = styled.div`
  padding: 2rem;
  
  p {
    color: #310121;
    font-size: 1.2rem;
    margin: 0;
  }
`

const Footer = styled.footer`
  margin-top: 2rem;
  
  p {
    margin: 0.5rem 0;
    color: #310121;
  }
`

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
`

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
`

interface TodoInputProps {
  todo: string
  setTodo: (value: string) => void
  addTodo: () => void
  setTodos: (todos: string[]) => void
  todos: string[]
}

const TodoInputComponent: React.FC<TodoInputProps> = ({ todo, setTodo, addTodo, setTodos, todos }) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (todo.trim() !== '') {
        setTodos([...todos, todo])
        setTodo('')
      }
    }
  }

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
  )
}

interface TodoListProps {
  todoList: string[]
  removeTodo: (task: string) => void
}

const TodoListComponent: React.FC<TodoListProps> = ({ todoList, removeTodo }) => {
  return (
    <TodoListContainer>
      {todoList?.length > 0 ? (
        <TodoList>
          {todoList.map((entry, index) => (
            <TodoItem key={index}>
              <TodoText>{entry}</TodoText>
              <DeleteButton onClick={() => removeTodo(entry)}>
                <SlTrash size={18} />
              </DeleteButton>
            </TodoItem>
          ))}
        </TodoList>
      ) : (
        <EmptyState>
          <p>Add some tasks! :)</p>
        </EmptyState>
      )}
    </TodoListContainer>
  )
}

const FooterComponent: React.FC = () => {
  return (
    <Footer>
      <p>Made with 💖</p>
      <SocialsContainer>
        <a href="https://github.com/adelicia-js" rel="noreferrer" target="_blank">
          <VscGithub size={25} />
        </a>
        <a href="https://www.linkedin.com/in/adelicia/" rel="noreferrer" target="_blank">
          <SiLinkedin size={25} />
        </a>
      </SocialsContainer>
      <p>
        <SourceLink href="https://github.com/adelicia-js/todo-cra" rel="noreferrer" target="_blank">
          $Source | 2023 - 2024
        </SourceLink>
      </p>
    </Footer>
  )
}

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState<string[]>([])

  const addTodo = () => {
    if (todo.trim() !== '') {
      setTodos([...todos, todo])
      setTodo('')
    }
  }

  const deleteTodo = (task: string) => {
    const newTodos = todos.filter((todo) => todo !== task)
    setTodos(newTodos)
  }

  return (
    <AppContainer>
      <Title>Make a To-Do List!</Title>
      <Content>
        <TodoInputComponent 
          todo={todo} 
          setTodo={setTodo} 
          addTodo={addTodo} 
          setTodos={setTodos} 
          todos={todos} 
        />
        <TodoListComponent todoList={todos} removeTodo={deleteTodo} />
      </Content>
      <FooterComponent />
    </AppContainer>
  )
}

export default App
