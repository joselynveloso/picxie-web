import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {title && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4 lg:px-8">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            </div>
          </header>
        )}

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
