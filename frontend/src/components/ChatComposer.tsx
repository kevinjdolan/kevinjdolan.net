import { SendHorizontal } from "lucide-react";
import type { FormEvent, KeyboardEvent, RefObject } from "react";

type ChatComposerProps = {
  composerRef: RefObject<HTMLFormElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  disabled: boolean;
  isActive: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatComposer({
  composerRef,
  inputRef,
  value,
  disabled,
  isActive,
  onChange,
  onSubmit
}: ChatComposerProps) {
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const modifier = isMac ? "⌘" : "Ctrl";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") return;
    const shouldSend = isMac ? event.metaKey : event.ctrlKey;

    if (shouldSend) {
      event.preventDefault();
      onSubmit();
    }
  }

  function handleChange(nextValue: string) {
    onChange(nextValue);
    const input = inputRef.current;
    if (!input) return;

    input.style.height = "";
    input.style.height = `${Math.min(input.scrollHeight, 220)}px`;
  }

  return (
    <form ref={composerRef} className="composer-wrap" autoComplete="off" onSubmit={submit}>
      <div className="composer">
        <textarea
          ref={inputRef}
          className="input"
          rows={3}
          placeholder={isActive ? "" : "Ask Me Anything"}
          spellCheck
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="composer-row">
          <span className="hint">
            <kbd>↵</kbd> newline &nbsp;·&nbsp; <kbd>{modifier}</kbd>
            <kbd>↵</kbd> send
          </span>
          <button className="send" type="submit" disabled={disabled || value.trim().length === 0}>
            <span>Send</span>
            <SendHorizontal aria-hidden="true" size={16} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </form>
  );
}
