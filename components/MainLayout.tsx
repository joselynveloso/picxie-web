import BottomNav from './BottomNav';
import FloatingUploadButton from './FloatingUploadButton';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <BottomNav />
      <FloatingUploadButton />

      <main className="relative pb-32">
        {title && (
          <header className="sticky top-0 z-10 py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <h1 className="text-6xl font-bold text-white tracking-tight">{title}</h1>
            </div>
          </header>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
