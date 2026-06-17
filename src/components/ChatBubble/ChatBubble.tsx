import React from 'react';

import { Message } from '../../types';
import { Avatar } from '../ui';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 mb-4 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar size="sm" variant={isUser ? 'primary' : 'secondary'}>
        {isUser ? '😊' : '🌸'}
      </Avatar>

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary/10 text-foreground rounded-tr-sm'
            : 'bg-surface shadow-soft text-foreground rounded-tl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs text-muted mt-1.5">
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
