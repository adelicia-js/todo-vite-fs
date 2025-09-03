import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Auth from "./components/Auth";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Footer from "./components/Footer";
import { todoAPI } from "./services/api";
import type { Todo, User, AuthResponse } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [todosPerPage] = useState(6);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          // Don't call fetchTodos here - let the other useEffect handle it
        } else {
          setLoading(false);
        }
      } catch (error) {
        // The interceptor in api.ts will handle the 401 error
        console.error("Token validation failed:", error);
        setLoading(false);
      }
    };

    validateToken();
  }, []); // Remove fetchTodos dependency

  const fetchTodos = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos(page, todosPerPage);
      setTodos(response.todos);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, todosPerPage]);

  const addTodo = async () => {
    if (todo.trim() !== "") {
      const todoText = todo.trim();
      setTodo(""); // Clear input immediately
      
      // Create optimistic todo with temporary ID
      const optimisticTodo: Todo = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: todoText,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: user?.id || ""
      };

      // Update counts immediately
      const newTotalCount = totalCount + 1;
      const newTotalPages = Math.ceil(newTotalCount / todosPerPage);
      
      setTotalCount(newTotalCount);
      setTotalPages(newTotalPages);
      
      // If we're not on page 1, navigate there to see the new todo
      if (currentPage !== 1) {
        setCurrentPage(1);
        setTodos([optimisticTodo]); // Will be populated by useEffect
      } else {
        // We're on page 1, add to beginning and keep only first 6
        setTodos(prevTodos => [optimisticTodo, ...prevTodos].slice(0, todosPerPage));
      }

      try {
        // Make the actual API call in background
        const newTodo = await todoAPI.createTodo(todoText);
        
        // Replace the optimistic todo with real one (only if still visible)
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === optimisticTodo.id ? newTodo : t)
        );
      } catch (error) {
        console.error("Failed to create todo:", error);
        
        // Rollback on error
        setTodos(prevTodos => prevTodos.filter(t => t.id !== optimisticTodo.id));
        setTotalCount(prevCount => prevCount - 1);
        setTotalPages(Math.ceil((newTotalCount - 1) / todosPerPage));
        
        // Show error to user
        setErrorMessage("Failed to add todo. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
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

  const toggleComplete = async (todoId: string, completed: boolean) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(
        todoId,
        undefined,
        completed
      );
      setTodos(todos.map((t) => (t.id === todoId ? updatedTodo : t)));
    } catch (error) {
      console.error("Failed to toggle todo completion:", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (deletingId) return; // Prevent multiple deletions at once
    
    setDeletingId(todoId);

    try {
      // Make the actual API call first (no optimistic update for pagination reasons)
      await todoAPI.deleteTodo(todoId);
      
      // Calculate what should happen after deletion
      const newTotalCount = totalCount - 1;
      const newTotalPages = Math.ceil(newTotalCount / todosPerPage);
      
      // If we're now on a page that shouldn't exist, go to the last valid page
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
        // The useEffect will fetch the correct page
      } else {
        // Stay on current page but refresh to get correct data
        await fetchTodos(currentPage);
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
      setErrorMessage("Failed to delete todo. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAuthSuccess = (authData: AuthResponse) => {
    setUser(authData.user);
    fetchTodos(1); // Start with page 1 for new user
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setTodos([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalCount(0);
    setDeletingId(null);
  };

  // Effect to fetch todos when page changes or user is set
  useEffect(() => {
    if (user) {
      fetchTodos(currentPage);
    }
  }, [currentPage, user, fetchTodos]);

  const paginate = (pageNumber: number) => {
    if (deletingId) return; // Prevent pagination during delete
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at once
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationButton
            key={i}
            onClick={() => paginate(i)}
            $active={currentPage === i}
          >
            {i}
          </PaginationButton>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationButton
          key={1}
          onClick={() => paginate(1)}
          $active={currentPage === 1}
        >
          1
        </PaginationButton>
      );

      // Determine the range around current page
      let startPage, endPage;
      
      if (currentPage <= 3) {
        // Near beginning: 1 2 3 4 ... last
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... (last-3) (last-2) (last-1) last
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      } else {
        // Middle: 1 ... (current-1) current (current+1) ... last
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Add ellipsis before middle section if needed
      if (startPage > 2) {
        pages.push(
          <EllipsisSpan key="ellipsis-start">...</EllipsisSpan>
        );
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationButton
            key={i}
            onClick={() => paginate(i)}
            $active={currentPage === i}
          >
            {i}
          </PaginationButton>
        );
      }

      // Add ellipsis after middle section if needed
      if (endPage < totalPages - 1) {
        pages.push(
          <EllipsisSpan key="ellipsis-end">...</EllipsisSpan>
        );
      }

      // Always show last page (if not already shown)
      if (totalPages > 1) {
        pages.push(
          <PaginationButton
            key={totalPages}
            onClick={() => paginate(totalPages)}
            $active={currentPage === totalPages}
          >
            {totalPages}
          </PaginationButton>
        );
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #f5f1e8 0%, #f0ebe0 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Kalam, cursive",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            color: "#1e40af",
            textAlign: "center",
            transform: "rotate(-1deg)",
          }}
        >
          Loading your notebook...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <AppContainer>
      <SpiralBinding>
        <SpiralHole />
        <SpiralHole />
        <SpiralHole />
        <SpiralHole />
        <SpiralHole />
        <SpiralHole />
        <SpiralHole />
      </SpiralBinding>

      <PageHeader>
        <PageTitle>My Todo List</PageTitle>
        <PageDate>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </PageDate>
        <UserInfo>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      </PageHeader>

      <TodoInput
        todo={todo}
        setTodo={setTodo}
        addTodo={addTodo}
        todos={todos}
      />

      <TodoList
        todoList={todos}
        removeTodo={deleteTodo}
        updateTodo={updateTodo}
        toggleComplete={toggleComplete}
        deletingId={deletingId}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationInfo>
            Page {currentPage} of {totalPages} ({totalCount} total todos)
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
{renderPaginationNumbers()}
            <PaginationButton
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      )}

      <Doodle className="doodle-1">⭐</Doodle>
      <Doodle className="doodle-2">→</Doodle>
      <Doodle className="doodle-3">♫</Doodle>

      <PageNumber>Page {currentPage}</PageNumber>
      <Footer />
      
      {errorMessage && (
        <ErrorToast>
          {errorMessage}
        </ErrorToast>
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #f5f1e8 0%, #f0ebe0 100%);
  min-height: 100vh;
  font-family: "Kalam", cursive;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #faf7f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(139, 69, 19, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 40px 60px 40px 80px;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text y='20' font-size='20'>🖋️</text></svg>") 12 12, auto;
  background-image: repeating-linear-gradient(
    transparent,
    transparent 25px,
    rgba(2, 132, 199, 0.1) 25px,
    rgba(2, 132, 199, 0.1) 26px
  );

  &::before {
    content: "";
    position: absolute;
    left: 50px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #dc2626;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    margin: 10px;
    padding: 30px 40px 30px 60px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    margin: 5px;
    padding: 25px 30px 25px 50px;
    border-radius: 4px;

    &::before {
      left: 40px;
    }
  }

  @media (max-width: 360px) {
    margin: 0;
    padding: 20px 25px 20px 45px;
    border-radius: 0;
    min-height: 100vh;
    box-shadow: none;

    &::before {
      left: 35px;
    }
  }
`;

const SpiralBinding = styled.div`
  position: absolute;
  left: 15px;
  top: 20px;
  bottom: 20px;
  width: 20px;
`;

const SpiralHole = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid #8b4513;
  border-radius: 50%;
  margin-bottom: 30px;
  background: #f5f1e8;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
`;

const PageTitle = styled.h1`
  font-family: "Caveat", cursive;
  font-size: 2.5rem;
  color: #1e40af;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transform: rotate(-1deg);
  margin-bottom: 5px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }

  @media (max-width: 360px) {
    font-size: 1.5rem;
  }
`;

const PageDate = styled.div`
  font-size: 1rem;
  color: #6b7280;
  transform: rotate(0.5deg);
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  @media (max-width: 360px) {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }
`;

const UserInfo = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    margin-top: 0.75rem;
  }
`;

const LogoutButton = styled.button`
  font-family: "Kalam", cursive;
  background: #1e40af;
  color: white;
  border: 2px solid #1e40af;
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: rotate(-1deg);

  &:hover {
    background: transparent;
    color: #1e40af;
    transform: rotate(1deg);
  }
`;

const Doodle = styled.div`
  position: absolute;
  font-size: 1.2rem;
  color: #9ca3af;
  opacity: 0.6;
  pointer-events: none;

  &.doodle-1 {
    top: 80px;
    right: 30px;
    transform: rotate(15deg);
  }

  &.doodle-2 {
    bottom: 100px;
    right: 40px;
    transform: rotate(-10deg);
  }

  &.doodle-3 {
    top: 200px;
    left: 20px;
    transform: rotate(25deg);
  }
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 0.9rem;
  color: #9ca3af;
  font-style: italic;
`;

const Pagination = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PaginationInfo = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
  font-style: italic;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  overflow-x: auto;
  padding: 0.25rem;

  @media (max-width: 480px) {
    gap: 0.25rem;
    padding: 0.5rem;
    
    /* Hide scrollbar but keep scrolling */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  font-family: "Kalam", cursive;
  background: ${(props) => (props.$active ? "#1e40af" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#1e40af")};
  border: 2px solid #1e40af;
  border-radius: 50%;
  padding: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-2deg);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #1e40af;
    color: white;
    transform: rotate(2deg);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: transparent;
    color: #9ca3af;
    border-color: #9ca3af;
    transform: rotate(0deg);
  }

  &:nth-child(odd) {
    transform: rotate(1deg);
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
  }

  @media (max-width: 480px) {
    min-width: 32px;
    height: 32px;
    font-size: 0.75rem;
    padding: 0.4rem;
  }

  @media (max-width: 360px) {
    min-width: 30px;
    height: 30px;
    font-size: 0.7rem;
    padding: 0.35rem;
  }
`;

const EllipsisSpan = styled.span`
  color: #6b7280;
  font-family: "Kalam", cursive;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  height: 35px;
  padding: 0 0.25rem;
  user-select: none;
  transform: rotate(-1deg);
`;

const ErrorToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #dc2626;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-family: 'Kalam', cursive;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  transform: rotate(-1deg);
  max-width: calc(100vw - 40px);

  @keyframes slideIn {
    from {
      transform: translateX(100%) rotate(-1deg);
      opacity: 0;
    }
    to {
      transform: translateX(0) rotate(-1deg);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
    max-width: none;
  }

  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
    left: 5px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`;

export default App;
