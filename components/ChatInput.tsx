import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-10">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="relative flex-1 bg-slate-100 hover:bg-slate-50 focus-within:bg-white transition-colors rounded-2xl border border-transparent focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a plan (e.g., 'Plan for Monday in Cairo')..."
              className="w-full bg-transparent border-none px-4 py-3 focus:ring-0 resize-none max-h-[150px] text-slate-800 placeholder-slate-400 text-base"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
              !input.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg active:scale-95'
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 transform rotate-90 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-400">
             AI analyzes live sheet data. Double-check plans before execution.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;