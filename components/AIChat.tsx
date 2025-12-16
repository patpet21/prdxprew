
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import useUndoRedo from "../hooks/useUndoRedo";
import "./AIChat.css";

interface Message {
  role: "user" | "model";
  content: string;
}

const AIChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.API_KEY;

  // Use the custom undo/redo hook instead of simple useState
  const { 
    state: messages, 
    setState: setMessages, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useUndoRedo<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;
    if (isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    
    // Add user message to state (pushes to history)
    setMessages((prev) => [...prev, userMessage]);
    
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });

      const aiMessage: Message = {
        role: "model",
        content: response.text || "No response generated.",
      };

      // Add AI response to state (pushes to history)
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h2>AI Assistant</h2>
        <div className="ai-chat-controls">
          <button 
            onClick={undo} 
            disabled={!canUndo || isLoading} 
            className="control-btn"
            title="Undo last message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo || isLoading} 
            className="control-btn"
            title="Redo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"></path>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation with the AI.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.role === "user" ? "user-message" : "ai-message"
            }`}
          >
            <div className="message-role">
              {msg.role === "user" ? "You" : "Gemini"}
            </div>
            <div className="message-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-bubble ai-message">
             <div className="message-role">Gemini</div>
             <div className="typing-indicator">
               <span></span><span></span><span></span>
             </div>
          </div>
        )}
        
        {error && <div className="error-banner">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !apiKey}
        />
        <button type="submit" disabled={isLoading || !input.trim() || !apiKey}>
          Send
        </button>
      </form>
      {!apiKey && <div className="api-warning">API_KEY not configured.</div>}
    </div>
  );
};

export default AIChat;
