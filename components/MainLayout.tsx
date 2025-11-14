import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 relative">
        {title && (
          <header className="glass-medium border-b border-white/10 sticky top-0 z-10">
            <div className="px-6 py-5 lg:px-8">
              <h2 className="text-3xl font-semibold text-gray-100 tracking-tight">{title}</h2>
            </div>
          </header>
        )}

        <div className="p-6 lg:p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
