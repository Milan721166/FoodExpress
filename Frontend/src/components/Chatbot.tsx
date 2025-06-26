// components/Chatbot.tsx
import React, { useState, KeyboardEvent } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = (): void => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: getBotResponse(inputValue), sender: 'bot' }]);
    }, 500);
    
    setInputValue('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (input.includes('help')) {
      return "I can help with general questions about our service. Try asking about features, pricing, or support.";
    } else if (input.includes('contact')) {
      return "You can reach our support team at support@example.com or through the Contact page.";
    } 
    else if (input.includes('build')) {
      return "Milan and Malay built me. We are here to assist you with any questions you may have.";
    }else {
      return "I'm sorry, I didn't understand that. Could you please rephrase your question?";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-t-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Support Chat</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}
                style={{ maxWidth: '80%' }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-l-lg p-2 focus:outline-none"
              aria-label="Chat input"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;