import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  code?: string;
  languageId?: string;
  mediaContext?: {
    type: string;
    content: string;
  };
}

export function ChatMessage({ content, isUser, code, languageId, mediaContext }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMedia = () => {
    if (!mediaContext) return null;

    const { type, content } = mediaContext;
    
    if (type.startsWith('image/')) {
      return (
        <img src={content} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />
      );
    }
    
    if (type.startsWith('video/')) {
      return (
        <video controls className="max-w-full rounded-lg">
          <source src={content} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (type.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={content} type={type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    
    if (type === 'application/pdf') {
      return (
        <iframe
          src={content}
          className="w-full h-96 rounded-lg"
          title="PDF document"
        />
      );
    }

    return null;
  };

  return (
    <div className={cn("message", isUser ? "user-message" : "bot-message")}>
      <div className="message-content">
        <p className="text-sm">{content}</p>
        {mediaContext && (
          <div className="mt-2">
            {renderMedia()}
          </div>
        )}
        {code && (
          <div className="code-block mt-2">
            {languageId && (
              <span className="language-badge">{languageId}</span>
            )}
            <pre>
              <code>{code}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(code)}
              className="copy-button"
              title="Copy code"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}