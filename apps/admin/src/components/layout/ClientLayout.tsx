"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { AuthProvider, useAdminAuth } from "@/components/providers/AuthProvider";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

function AuthGuard({ children, isAuthPage }: { children: React.ReactNode, isAuthPage: boolean }) {
  const { token, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token && !isAuthPage) {
      window.location.href = '/login';
    }
  }, [isLoading, token, isAuthPage]);

  if (isLoading && !isAuthPage) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wine"></div>
      </div>
    );
  }

  if (!token && !isAuthPage) {
    return null;
  }

  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname?.startsWith("/login/") || false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AuthProvider>
        <AuthGuard isAuthPage={isAuthPage}>
          {isAuthPage ? (
            <div className="flex-1 overflow-y-auto w-full">
            {children}
          </div>
        ) : (
          <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col overflow-hidden w-full">
              <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-8 z-10 shadow-sm">
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden mr-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Menu size={24} />
                  </button>
                  <h1 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] hidden sm:block">System Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://atlas.grekam.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-wine text-ivory px-4 md:px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-wine-dark hover:shadow-lg hover:shadow-wine/20 transition-all active:scale-95"
                  >
                    View Live Store
                  </a>
                </div>
              </header>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[var(--bg)] w-full overflow-x-hidden">
                {children}
              </div>
            </main>
          </>
        )}
        </AuthGuard>
      </AuthProvider>
    </>
  );
}
