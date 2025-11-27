import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import WelcomePopup from './components/WelcomePopup';
import { Message, LoadingState } from './types';
import { generatePlanResponse } from './services/geminiService';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I'm your MedRep Planning Assistant. \n\nI have access to the live Doctors' Sheet. How can I help you plan your visits today?",
      timestamp: new Date(),
    },
  ]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingState(LoadingState.FETCHING_DATA);

    try {
      // Convert current chat history to Gemini format (exclude errors)
      const history = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      // API Call
      const responseText = await generatePlanResponse(text, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error connecting to the data source or the AI service. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">MedRep Planner AI</h1>
            <p className="text-xs text-teal-600 font-medium">Connected to Google Sheets</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto w-full flex flex-col pb-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {loadingState !== LoadingState.IDLE && (
            <div className="flex justify-start w-full mb-4">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="ml-2 font-medium text-xs uppercase tracking-wider">
                    {loadingState === LoadingState.FETCHING_DATA ? 'Reading Sheet...' : 'Generating Plan...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} isLoading={loadingState !== LoadingState.IDLE} />
    </div>
  );
};

export default App;