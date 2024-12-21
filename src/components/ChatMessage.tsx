import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  code?: string;
  languageId?: string;
}

export function ChatMessage({ content, isUser, code, languageId }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("message", isUser ? "user-message" : "bot-message")}>
      <div className="message-content">
        <p className="text-sm">{content}</p>
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