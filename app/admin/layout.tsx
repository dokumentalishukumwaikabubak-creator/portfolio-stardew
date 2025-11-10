'use client';

import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Individual pages handle their own auth logic
  // Do not put global redirect here as it breaks /admin/login
  return <>{children}</>;
}