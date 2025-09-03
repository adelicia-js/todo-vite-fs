import { useState } from "react";
import styled from "styled-components";
import { authAPI } from "../services/api";
import type { AuthResponse } from "../types";

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #352418ff 0%, #a0522d 25%, #cd853f 50%, #daa520 75%, #f4a460 100%);
  font-family: "Kalam", cursive;
  padding: 2rem;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text y='20' font-size='20'>🖋️</text></svg>") 12 12, auto;
`;

const BookCover = styled.div`
  position: relative;
  background: #8B4513;
  background: linear-gradient(145deg, #A0522D 0%, #8B4513 50%, #654321 100%);
  border-radius: 8px 12px 12px 8px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 0 0 3px #654321,
    0 0 0 6px #8B4513,
    8px 8px 20px rgba(101, 67, 33, 0.4),
    inset 2px 2px 5px rgba(255, 255, 255, 0.1),
    inset -2px -2px 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  transform: rotate(-1deg);
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(0deg);
  }

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 2px solid #DAA520;
    border-radius: 4px;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    left: -6px;
    top: 20px;
    bottom: 20px;
    width: 3px;
    background: linear-gradient(to bottom, #654321 0%, #8B4513 50%, #654321 100%);
    border-radius: 2px;
  }
`;

const BookTitle = styled.h1`
  font-family: "Caveat", cursive;
  color: #F5DEB3;
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transform: rotate(-0.5deg);
  letter-spacing: 2px;
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const BookSubtitle = styled.div`
  color: #DAA520;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-style: italic;
  transform: rotate(0.3deg);
  opacity: 0.9;
`;

const BookSpine = styled.div`
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(to bottom, #654321 0%, #8B4513 50%, #654321 100%);
  border-radius: 4px 0 0 4px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  font-family: "Kalam", cursive;
  border: none;
  border-bottom: 2px dotted #DAA520;
  border-radius: 0;
  background: transparent;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: #F5DEB3;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(245, 222, 179, 0.7);
    font-style: italic;
  }

  &:focus {
    border-bottom-color: #F5DEB3;
    background: rgba(245, 222, 179, 0.1);
    transform: rotate(-0.2deg);
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #8B4513 inset;
    -webkit-text-fill-color: #F5DEB3;
  }
`;

const Button = styled.button`
  font-family: "Kalam", cursive;
  background: linear-gradient(145deg, #DAA520, #B8860B);
  color: #654321;
  border: 2px solid #B8860B;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: rotate(-0.5deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: linear-gradient(145deg, #F5DEB3, #DAA520);
    transform: rotate(0.5deg) translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: rotate(0deg);
  }

  &:active {
    transform: rotate(-0.2deg) translateY(0);
  }
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #F5DEB3;
  font-family: "Kalam", cursive;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 1.5rem;
  padding: 0.5rem;
  border-radius: 15px;
  transition: all 0.2s ease;
  transform: rotate(0.3deg);
  text-decoration: underline;
  text-decoration-color: #DAA520;

  &:hover {
    background: rgba(245, 222, 179, 0.1);
    color: #DAA520;
    transform: rotate(-0.3deg);
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(145deg, #dc2626, #b91c1c);
  color: #fef2f2;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: "Kalam", cursive;
  border: 1px solid #f87171;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  transform: rotate(-0.2deg);
`;

interface AuthProps {
  onAuthSuccess: (authData: AuthResponse) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response: AuthResponse;

      if (isLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.register(email, password);
      }

      // Save token to localStorage
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      onAuthSuccess(response);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Authentication failed");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <BookCover>
        <BookSpine />
        
        <BookTitle>My Todo Notebook</BookTitle>
        <BookSubtitle>
          {isLogin ? "Welcome Back" : "Start Your Journey"}
        </BookSubtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder="Your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              placeholder="Your secret password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Opening notebook..." : isLogin ? "Open My Notebook" : "Create New Notebook"}
          </Button>
        </Form>

        <SwitchButton
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin ? "Need a new notebook? Create one here" : "Already have a notebook? Open it here"}
        </SwitchButton>
      </BookCover>
    </AuthContainer>
  );
};

export default Auth;
