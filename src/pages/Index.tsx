import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  code?: string;
  languageId?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async (content: string, code?: string, languageId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      code,
      languageId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Replace this URL with your Python backend server URL
      const response = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: content, code, languageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.response,
          isUser: false,
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default Index;