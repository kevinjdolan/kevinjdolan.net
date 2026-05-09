import { forwardRef } from "react";
import type { ChatMessage } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingBubble } from "./TypingBubble";

type MessageListProps = {
  messages: ChatMessage[];
  isActive: boolean;
  isTyping: boolean;
};

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(function MessageList(
  { messages, isActive, isTyping },
  ref
) {
  return (
    <>
      <div className="conv-halo" aria-hidden="true" />
      <div
        ref={ref}
        className={`conversation ${isActive ? "active" : ""}`}
        aria-live="polite"
        aria-label="KevinBot conversation"
      >
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}-${message.content.slice(0, 16)}`} message={message} />
        ))}
        {isTyping ? <TypingBubble /> : null}
      </div>
    </>
  );
});
