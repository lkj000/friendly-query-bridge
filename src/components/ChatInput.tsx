import { Send } from "lucide-react";
import { useState } from "react";
import { MediaUpload } from "./MediaUpload";

interface ChatInputProps {
  onSend: (message: string, code?: string, languageId?: string, mediaContext?: { type: string; content: string }) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [mediaContext, setMediaContext] = useState<{ type: string; content: string } | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message, code, languageId, mediaContext);
      setMessage("");
      setCode("");
      setLanguageId("");
      setMediaContext(undefined);
      setShowCodeInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            disabled={disabled}
          />
          <MediaUpload onMediaContext={setMediaContext} />
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Code
          </button>
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send size={20} />
          </button>
        </div>
        {showCodeInput && (
          <div className="space-y-2">
            <input
              type="text"
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              placeholder="Language (e.g., python, javascript)"
              className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={5}
              className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
        )}
      </div>
    </form>
  );
}