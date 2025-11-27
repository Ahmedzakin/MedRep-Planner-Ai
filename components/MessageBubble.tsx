import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isModel = message.role === 'model';

  // Simple formatting for bold text (**text**) and lists (- item)
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Check for simple bullet points
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const content = isBullet ? line.trim().substring(2) : line;
      
      // Check for bold markdown-like syntax
      const parts = content.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className={`${isBullet ? 'pl-4 flex items-start' : 'min-h-[1.2em]'}`}>
          {isBullet && <span className="mr-2">•</span>}
          <span>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm relative group ${
          isUser
            ? 'bg-teal-600 text-white rounded-br-none'
            : isError
            ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none'
            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
        }`}
      >
        <div className="text-sm leading-relaxed font-normal">
            {formatContent(message.content)}
        </div>
        
        {/* Footer: Time */}
        <div className={`flex items-center justify-end mt-2 pt-1 ${isUser ? 'text-teal-100' : 'text-slate-400'}`}>
            <div className="text-[10px] opacity-70">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;