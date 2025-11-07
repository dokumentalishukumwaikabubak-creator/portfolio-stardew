'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: '📊'
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: '💼'
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: '🏷️'
  },
  {
    title: 'Skills',
    href: '/admin/skills',
    icon: '⚡'
  },
  {
    title: 'Personal Info',
    href: '/admin/personal-info',
    icon: '👤'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-stone-800">Admin Panel</h1>
        <p className="text-sm text-stone-600 mt-1">Portfolio Management</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}