// app/layout.tsx
import { ReactNode } from 'react';
import './globals.css';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="it">
      <body>
        <AuthWrapper>
          <Header />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}