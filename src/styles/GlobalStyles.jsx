import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    background-color: ${({ theme }) => theme.colors.bg};
    background-image: ${({ theme }) => theme.colors.pageGradient};
    background-attachment: fixed;
    background-blend-mode: screen, screen, normal;
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 300ms ease, color 300ms ease, background-image 300ms ease;
    min-height: 100dvh;
    overflow-x: hidden;
  }

  #root {
    min-height: 100dvh;
    overflow-x: hidden;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
    line-height: 1.2;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    max-width: 72ch;
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;
    transition: ${({ theme }) => theme.transition};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.full};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primaryHighlight};
    color: ${({ theme }) => theme.colors.text};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyles;
