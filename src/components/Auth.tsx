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
  background: linear-gradient(
    185deg,
    #f79177 0%,
    #b88571 25%,
    #c68fce 50%,
    #da7ca3 75%,
    #b92a59 100%
  );
  font-family: "Space Mono", monospace;
  padding: 2rem;
`;

const AuthBox = styled.div`
  background: #31012150;
  border-radius: 7px;
  padding: 2rem;
  box-shadow: 1px 0.1px 5px #31012194;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #310121;
  margin-bottom: 2rem;
  text-transform: uppercase;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  font-family: "Space Mono", monospace;
  border: 1px solid transparent;
  border-radius: 3px;
  background: #ffffffb0;
  padding: 0.75rem;
  font-size: 1rem;

  &:focus {
    outline: 1px solid #310121;
    box-shadow: 1px 0.1px 5px #310121a1;
  }
`;

const Button = styled.button`
  font-family: "Space Mono", monospace;
  background: #3101218e;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffffa2;
    color: #310121;
    border: 1px solid #310121;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #310121;
  font-family: "Space Mono", monospace;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  background: #ff6b6b;
  color: white;
  padding: 0.5rem;
  border-radius: 3px;
  margin-bottom: 1rem;
  text-align: center;
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
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Title>{isLogin ? "Login" : "Sign Up"}</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </Form>

        <SwitchButton
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </SwitchButton>
      </AuthBox>
    </AuthContainer>
  );
};

export default Auth;
