'use client';

import { supabase } from '@/lib/supabase';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear any local storage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('language');
        // Clear all Supabase related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      
      // Small delay to ensure session is cleared
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force full page reload to ensure clean state
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, force redirect and clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/admin/login';
      }
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
            {subtitle && (
              <p className="text-stone-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-stone-800">Admin User</p>
              <p className="text-xs text-stone-600">Portfolio Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
            <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="text-stone-600 text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}