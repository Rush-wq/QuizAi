import React from 'react';
import { ThemeToggle } from './ThemeToggle';
//import Login from './Login';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="app-container">
    {/* <Login /> */}
    <ThemeToggle />
    {children}
  </div>
);