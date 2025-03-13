
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  BarChart, 
  Calendar, 
  Settings
} from 'lucide-react';

export function ProfessionalBottomNav() {
  const location = useLocation();
  
  const navItems = [
    {
      href: '/professional',
      label: 'Home',
      icon: Home,
      exact: true
    },
    {
      href: '/professional/community',
      label: 'Community',
      icon: Users
    },
    {
      href: '/professional/insights',
      label: 'Insights',
      icon: BarChart
    },
    {
      href: '/professional/schedule',
      label: 'Schedule',
      icon: Calendar
    },
    {
      href: '/professional/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/40 shadow-md">
      <nav className="flex items-center justify-around px-1 py-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-2 px-2 text-[10px] font-medium",
                  "transition-colors duration-200",
                  isActive
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
