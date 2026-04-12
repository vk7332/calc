import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIAssistant({ onContactTrigger }: { onContactTrigger?: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI tax assistant. Ask me anything about income tax, deductions, or filing tips.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isUnsatisfactory = (content: string) => {
        const triggers = [
            'sorry', 'apologize', 'cannot answer', 'do not know', 
            'unable to', 'technical error', 'no information',
            'contact a professional', 'consult a ca'
        ];
        return triggers.some(t => content.toLowerCase().includes(t));
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional tax assistant for Indian income tax. Provide accurate, helpful advice about tax calculations, deductions, filing procedures, and compliance. If you are unsure or cannot provide a specific answer, politely suggest the user contact our specialist team.'
                        },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: input }
                    ],
                    max_tokens: 500
                }),
            });

            const data = await response.json();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.choices[0].message.content,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            if (isUnsatisfactory(aiMessage.content)) {
                const triggerMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: 'It seems I couldn\'t provide a fully satisfactory answer. Would you like to connect with our professional tax specialists directly?',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, triggerMessage]);
            }
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again later or contact our specialist team for direct assistance.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-green-600'
                                }`}>
                                {message.role === 'user' ? (
                                    <User size={16} className="text-white" />
                                ) : (
                                    <Bot size={16} className="text-white" />
                                )}
                            </div>
                            <div className={`rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                }`}>
                                <p className="text-sm">{message.content}</p>
                                {(message.content.includes('connect with our professional tax specialists') || message.content.includes('contact our specialist team')) && (
                                    <button 
                                        onClick={onContactTrigger}
                                        className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        Connect with Specialists
                                    </button>
                                )}
                                <p className="text-[10px] opacity-70 mt-2 font-medium">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="border-t dark:border-gray-700 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about tax deductions, filing, etc..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}