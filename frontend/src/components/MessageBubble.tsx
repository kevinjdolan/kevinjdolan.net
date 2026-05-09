import type { ChatMessage } from "../types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`msg ${isUser ? "user" : "bot"}`}>
      <div className="bubble">
        <div className="msg-head">
          <div className="bubble-avatar">{isUser ? "You" : "K"}</div>
          <span className="role">{isUser ? "You" : "KevinBot"}</span>
        </div>
        <div className="msg-body">{message.content}</div>
      </div>
    </div>
  );
}
