import { ReactNode } from 'react';

interface DashboardLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

/**
 * Root layout: fixed header + scrollable main content area.
 */
export function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {header}
      <main className="px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {children}
      </main>
    </div>
  );
}
