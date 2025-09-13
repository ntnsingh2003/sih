import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Bot, 
  User,
  Globe
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: 'en' | 'hi';
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI counselor. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const supportCategories = [
    'Academic Support',
    'Career Guidance', 
    'Mental Health',
    'Study Tips'
  ];

  const botResponses = {
    en: {
      academic: "I understand you're facing academic challenges. Can you tell me more about what specific subjects or topics you're struggling with?",
      career: "Career planning is important! What are your interests and what field are you considering for your future?",
      mental: "Your mental health matters. I'm here to listen. Would you like to talk about what's been bothering you?",
      study: "Here are some effective study tips: 1) Create a schedule 2) Take regular breaks 3) Find a quiet study space 4) Use active learning techniques. Which area would you like more help with?",
      default: "I'm here to help you with academic, career, or personal concerns. What would you like to discuss?"
    },
    hi: {
      academic: "मैं समझ सकता हूं कि आप शैक्षणिक चुनौतियों का सामना कर रहे हैं। क्या आप मुझे बता सकते हैं कि आपको कौन से विषयों में कठिनाई हो रही है?",
      career: "करियर प्लानिंग महत्वपूर्ण है! आपकी रुचियां क्या हैं और आप भविष्य के लिए किस क्षेत्र पर विचार कर रहे हैं?",
      mental: "आपका मानसिक स्वास्थ्य महत्वपूर्ण है। मैं यहां सुनने के लिए हूं। क्या आप इस बारे में बात करना चाहते हैं कि आपको क्या परेशान कर रहा है?",
      study: "यहां कुछ प्रभावी अध्ययन टिप्स हैं: 1) एक शेड्यूल बनाएं 2) नियमित ब्रेक लें 3) एक शांत अध्ययन स्थान खोजें 4) सक्रिय शिक्षण तकनीकों का उपयोग करें। आपको किस क्षेत्र में अधिक मदद चाहिए?",
      default: "मैं आपकी शैक्षणिक, करियर या व्यक्तिगत चिंताओं में मदद करने के लिए यहां हूं। आप क्या चर्चा करना चाहते हैं?"
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, [currentLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const responses = botResponses[currentLanguage];

    if (message.includes('academic') || message.includes('study') || message.includes('grade') || message.includes('शैक्षणिक') || message.includes('पढ़ाई')) {
      return responses.academic;
    } else if (message.includes('career') || message.includes('job') || message.includes('future') || message.includes('करियर') || message.includes('नौकरी')) {
      return responses.career;
    } else if (message.includes('mental') || message.includes('stress') || message.includes('anxiety') || message.includes('मानसिक') || message.includes('तनाव')) {
      return responses.mental;
    } else if (message.includes('tips') || message.includes('help') || message.includes('how') || message.includes('टिप्स') || message.includes('कैसे')) {
      return responses.study;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call backend API
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputText,
          language: currentLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to local response if API fails
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleCategoryClick = (category: string) => {
    setInputText(`I need help with ${category.toLowerCase()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Counselor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title="Switch Language"
          >
            <Globe className="h-4 w-4" />
          </button>
          <span className="text-sm">{currentLanguage.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-1">
          {supportCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-all"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  {message.sender === 'bot' && (
                    <button
                      onClick={() => speakMessage(message.text)}
                      className="mt-1 p-1 hover:bg-gray-200 rounded"
                      title="Speak message"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <Bot className="h-4 w-4" />
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

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={currentLanguage === 'en' ? 'Type your message...' : 'अपना संदेश लिखें...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleVoiceRecording}
            className={`p-2 rounded-lg transition-all ${
              isRecording 
                ? 'bg-red-100 text-red-600 voice-animation' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;