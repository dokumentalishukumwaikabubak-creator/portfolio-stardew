import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout will be handled by individual page components
  // Redirect to dashboard if someone tries to access /admin directly
  redirect('/admin/dashboard');
}