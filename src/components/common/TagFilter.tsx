import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTag,
  onSelectTag,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectTag(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
          selectedTag === null
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'
        }`}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selectedTag === tag
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};
