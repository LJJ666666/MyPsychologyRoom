import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = '心理治疗室',
  showSearch = false,
  showBack = false,
  onBack,
  rightContent,
}) => {
  return (
    <header className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border z-40">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={onBack}
              className="mr-3 p-1 -ml-1 rounded-lg hover:bg-surface-muted transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showSearch ? (
            <div className="flex items-center bg-surface-muted rounded-full px-4 py-2 w-64">
              <Search size={18} className="text-muted mr-2" />
              <input
                type="text"
                placeholder="搜索故事..."
                className="bg-transparent outline-none text-sm flex-1 placeholder-muted"
              />
            </div>
          ) : (
            <h1 className="font-serif text-xl font-semibold text-foreground">
              {title}
            </h1>
          )}
        </div>
        {rightContent || (
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-muted transition-colors relative">
              <Bell size={22} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
