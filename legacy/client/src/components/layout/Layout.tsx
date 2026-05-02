import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import MobileNav from './mobile-nav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}