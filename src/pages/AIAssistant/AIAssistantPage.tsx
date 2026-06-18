import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';

import { Header, BottomNav } from '../../components/Layout';
import { ChatBubble } from '../../components/ChatBubble';
import { useStore } from '../../store';
import { getAIResponse } from '../../data/mock';
import { Card, Button } from '../../components/ui';

export const AIAssistantPage: React.FC = () => {
  const { messages, addMessage, clearMessages } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    addMessage({
      role: 'user',
      content: inputText.trim(),
    });
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      const response = getAIResponse(inputText);
      addMessage({
        role: 'ai',
        content: response,
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleClear = () => {
    clearMessages();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <Header
        title="AI心理助手"
        rightContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={16} />
            新对话
          </Button>
        }
      />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto pb-8">
          {/* Welcome Card */}
          <Card className="!bg-gradient-to-br !from-primary/5 !to-accent/5 !shadow-none !border-0 mb-6">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-3 bg-surface rounded-full flex items-center justify-center shadow-soft">
                <span className="text-3xl">🌸</span>
              </div>
              <h2 className="font-serif text-lg font-medium text-foreground mb-2">
                你好，我是你的AI心理助手
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                在这里，你可以安全地倾诉自己的困惑和烦恼。我会用心倾听，给予共情和温暖的回应。
              </p>
            </div>
          </Card>

          {/* Messages */}
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 mb-4 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🌸</span>
                </div>
                <div className="bg-surface shadow-soft px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area - 在 BottomNav 上方 */}
      <div className="fixed left-0 right-0 z-40 bg-surface border-t border-border px-4 py-3" style={{ bottom: '64px' }}>
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="倾诉你的心事..."
            className="flex-1 px-5 py-3.5 bg-surface-muted rounded-full text-sm outline-none placeholder-muted focus:ring-2 focus:ring-primary/20 transition-shadow"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <Send size={20} strokeWidth={2} />
          </button>
        </div>
        <p className="text-xs text-center text-muted mt-3">
          AI助手仅供参考，如有严重心理困扰请寻求专业帮助
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default AIAssistantPage;
