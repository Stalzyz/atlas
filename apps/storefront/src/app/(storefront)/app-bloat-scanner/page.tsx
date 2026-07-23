import { Metadata } from 'next';
import { AppBloatScanner } from '@/components/scanner/AppBloatScanner';

export const metadata: Metadata = {
  title: 'App Bloat Scanner | Atlas Commerce',
  description: 'Calculate how much money you are losing to third-party Shopify apps. See how much you can save with Atlas.',
};

export default function AppBloatScannerPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-24 relative overflow-hidden font-[family-name:var(--body-font)]">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute top-60 -left-40 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AppBloatScanner />
      </div>
    </main>
  );
}
