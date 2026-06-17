import React from 'react';
import { Heart, Home, Users, User } from 'lucide-react';
import { useStore } from '../../store';

interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const { activeTab, setActiveTab } = useStore();

  const tabs = [
    { id: 'home' as const, label: '故事', icon: Home },
    { id: 'ai' as const, label: 'AI助手', icon: Heart },
    { id: 'cross-age' as const, label: '跨龄视角', icon: Users },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50 ${className}`}
    >
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon
                size={24}
                className={`mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
