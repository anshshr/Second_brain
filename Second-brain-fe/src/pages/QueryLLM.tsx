import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedLinks?: RelatedLink[];
}

interface RelatedLink {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  type: string;
}

const QueryLLM = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/query-llm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userMessage.content })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        relatedLinks: data.relatedLinks || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Knowledge Assistant
                </h1>
                <p className="text-gray-600 text-sm">Ask questions about your saved content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearChat}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Chat
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
              >
                Dashboard
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to your AI Assistant!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Ask me anything about your saved content. I'll search through your links, tags, and provide relevant information.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600">💡 Try asking:</p>
                  <p className="font-medium text-gray-800">"What articles do I have about React?"</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600">🔍 Or search for:</p>
                  <p className="font-medium text-gray-800">"Show me videos about JavaScript"</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  } rounded-2xl px-6 py-4 shadow-sm`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      <span className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-white'}`}>
                        {message.type === 'user' ? '👤' : '🤖'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      {/* Related Links */}
                      {message.relatedLinks && message.relatedLinks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-3">📚 Related content from your library:</p>
                          <div className="space-y-2">
                            {message.relatedLinks.map((link) => (
                              <div key={link._id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <a
                                      href={link.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      {getTypeIcon(link.type)} {link.title}
                                    </a>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {link.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything about your saved content..."
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none bg-transparent placeholder-gray-500"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'image': return '🖼️';
    case 'video': return '🎥';
    case 'audio': return '🎵';
    case 'article': return '📄';
    default: return '🔗';
  }
};

export default QueryLLM;
