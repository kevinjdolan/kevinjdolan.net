export function TypingBubble() {
  return (
    <div className="msg bot">
      <div className="bubble">
        <div className="msg-head">
          <div className="bubble-avatar">K</div>
          <span className="role">KevinBot</span>
        </div>
        <div className="msg-body">
          <span className="typing" aria-label="KevinBot is typing">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
    </div>
  );
}
