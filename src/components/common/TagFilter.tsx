import React from 'react';

import { Tag } from '../ui';

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
      <Tag
        variant={selectedTag === null ? 'primary' : 'outline'}
        onClick={() => onSelectTag(null)}
        className="!py-2 !px-4 !text-sm whitespace-nowrap"
      >
        全部
      </Tag>
      {tags.map((tag) => (
        <Tag
          key={tag}
          variant={selectedTag === tag ? 'primary' : 'outline'}
          onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
          className="!py-2 !px-4 !text-sm whitespace-nowrap"
        >
          #{tag}
        </Tag>
      ))}
    </div>
  );
};

export default TagFilter;
