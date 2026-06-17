import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Home, Users, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { id: 'home', label: '故事', icon: Home, to: '/' },
    { id: 'ai', label: 'AI助手', icon: Heart, to: '/ai' },
    { id: 'cross-age', label: '跨龄视角', icon: Users, to: '/cross-age' },
    { id: 'profile', label: '我的', icon: User, to: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={24}
                    className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-xs font-medium">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
