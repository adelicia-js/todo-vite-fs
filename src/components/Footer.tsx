import styled from "styled-components";
import { VscGithub } from "react-icons/vsc";
import { SiLinkedin } from "react-icons/si";

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>Made with 💖 and lots of ☕</p>
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
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  position: absolute;
  width:100%;
  bottom: 0;
  left: 15px;
  text-align: center;
  font-family: 'Kalam', cursive;

  p {
    margin: 0.5rem 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const SocialsContainer = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 0 0;

  a {
    color: #1e40af;
    transition: all 0.2s ease;
    font-size: 1.2rem;

    &:visited {
      color: #1e40af;
    }

    &:hover {
      color: #1e40af;
      transform: rotate(-5deg) scale(1.1);
    }
  }
`;

const SourceLink = styled.a`
  text-decoration: none;
  color: #6b7280;
  font-style: italic;
  font-size: 0.8rem;
  transform: rotate(0.5deg);
  display: inline-block;
  transition: all 0.2s ease;

  &:visited {
    color: #6b7280;
  }

  &:hover {
    color: #1e40af;
    transform: rotate(-0.5deg);
  }
`;

export default Footer;