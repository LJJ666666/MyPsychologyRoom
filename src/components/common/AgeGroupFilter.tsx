import React from 'react';
import { Tag } from '../ui';
import { AgeGroup, AGE_GROUP_LABELS } from '../../types';

interface AgeGroupFilterProps {
  selectedAgeGroup: AgeGroup | null;
  onSelectAgeGroup: (ageGroup: AgeGroup | null) => void;
}

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const AgeGroupFilter: React.FC<AgeGroupFilterProps> = ({
  selectedAgeGroup,
  onSelectAgeGroup,
}) => {
  const groups: AgeGroup[] = ['teen', 'worker', 'parent', 'elder'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Tag
        variant={selectedAgeGroup === null ? 'primary' : 'outline'}
        onClick={() => onSelectAgeGroup(null)}
        className="!py-2 !px-4 !text-sm whitespace-nowrap"
      >
        全年龄段
      </Tag>
      {groups.map((group) => (
        <Tag
          key={group}
          variant={selectedAgeGroup === group ? 'primary' : 'outline'}
          onClick={() => onSelectAgeGroup(selectedAgeGroup === group ? null : group)}
          className="!py-2 !px-4 !text-sm whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{AGE_GROUP_ICONS[group]}</span>
          <span>{AGE_GROUP_LABELS[group]}</span>
        </Tag>
      ))}
    </div>
  );
};

export default AgeGroupFilter;
