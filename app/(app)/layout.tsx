import { AppLayout } from '@/components/ui/Layout';

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
