import { useEffect, useRef, useState } from "react";
import { sendChat } from "../lib/api";
import type { ChatMessage, Profile } from "../types";
import { ChatComposer } from "./ChatComposer";
import { ChatHero } from "./ChatHero";
import { MessageList } from "./MessageList";
import { useChatDocking } from "../hooks/useChatDocking";

type ChatPageProps = {
  profile: Profile;
};

const failureMessage: ChatMessage = {
  role: "assistant",
  content: "Hmm, I could not reach the API just now. Try again in a sec?"
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ChatPage({ profile }: ChatPageProps) {
  const [draft, setDraft] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);
  const composerRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const { activate, resetDocking, transitionMs } = useChatDocking({
    active: chatActive,
    composerRef,
    heroRef
  });

  function setMessages(nextMessages: ChatMessage[]) {
    messagesRef.current = nextMessages;
    setMessagesState(nextMessages);
  }

  useEffect(() => {
    const input = inputRef.current;
    window.setTimeout(() => input?.focus(), 100);
    return () => resetDocking();
  }, [resetDocking]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation || !chatActive) return;
    conversation.scrollTo({ top: conversation.scrollHeight, behavior: "smooth" });
  }, [chatActive, messages, isSending]);

  async function submitMessage() {
    const text = draft.trim();
    if (!text || isSending) return;

    const wasInactive = !chatActive;
    if (wasInactive && activate()) {
      setChatActive(true);
      window.setTimeout(() => setHeroVisible(false), transitionMs + 40);
    }

    setDraft("");
    setIsSending(true);

    if (wasInactive) {
      await delay(transitionMs);
    }

    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messagesRef.current, userMessage];
    setMessages(nextMessages);

    try {
      const reply = await sendChat(nextMessages);
      setMessages([...nextMessages, reply]);
    } catch (error) {
      console.error(error);
      setMessages([...nextMessages, failureMessage]);
    } finally {
      setIsSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  return (
    <section id="view-chat" className="chat-view">
      {heroVisible ? <ChatHero profile={profile} heroRef={heroRef} /> : null}
      <MessageList
        ref={conversationRef}
        messages={messages}
        isActive={chatActive || messages.length > 0 || isSending}
        isTyping={isSending && messages.length > 0}
      />
      <ChatComposer
        composerRef={composerRef}
        inputRef={inputRef}
        value={draft}
        disabled={isSending}
        isActive={chatActive}
        onChange={setDraft}
        onSubmit={submitMessage}
      />
    </section>
  );
}
