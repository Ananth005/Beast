
import { Header } from '@/components/layout/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { AuthGuard } from '@/contexts/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <div className="flex flex-1">
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </main>
            <SidebarNav />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
