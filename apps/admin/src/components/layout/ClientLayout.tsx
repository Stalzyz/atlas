"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { AuthProvider, useAdminAuth } from "@/components/providers/AuthProvider";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

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
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-8 z-10 shadow-sm">
                <h1 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">System Overview</h1>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://atlas.grekam.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-wine text-ivory px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-wine-dark hover:shadow-lg hover:shadow-wine/20 transition-all active:scale-95"
                  >
                    View Live Store
                  </a>
                </div>
              </header>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[var(--bg)]">
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
