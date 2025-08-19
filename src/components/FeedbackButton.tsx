import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || ""; // 비워두면 동일 오리진(/api)

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function submit() {
    setSending(true);
    setOkMsg("");
    try {
      const r = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await r.json();
      if (data.ok) {
        setOkMsg("의견이 저장되었습니다.");
        setMessage(""); setEmail(""); setName("");
        setTimeout(() => setOpen(false), 800);
      } else {
        alert(data.error || "오류가 발생했습니다.");
      }
    } catch {
      alert("전송 실패. 네트워크를 확인하세요.");
    } finally {
      setSending(false);
    }
  }

  // 기존 FAB과 겹치지 않게 살짝 위로 배치 (bottom-24)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="의견 보내기"
        title="의견 보내기"
        className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center text-white fixed right-6 bottom-24 z-50"
      >
        ✉️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--overlay)] flex items-center justify-center">
          <div className="w-full max-w-[520px] bg-[var(--surface)] text-[var(--text)] rounded-2xl shadow ring-1 ring-[var(--border)]/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-semibold">의견 보내기</h3>
              <button onClick={() => setOpen(false)} className="text-sm opacity-70 hover:underline">닫기</button>
            </div>
            <div className="p-5 grid gap-3">
              <input className="border border-[var(--border)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                     placeholder="이름(선택)" value={name} onChange={e => setName(e.target.value)} />
              <input className="border border-[var(--border)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                     placeholder="이메일(선택)" value={email} onChange={e => setEmail(e.target.value)} />
              <textarea className="border border-[var(--border)] rounded px-3 py-2 h-40 resize-vertical focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                        placeholder="의견을 입력하세요 (최대 5000자)" value={message} onChange={e => setMessage(e.target.value)} />
              {okMsg && <div className="text-sm text-[var(--accent)]">{okMsg}</div>}
            </div>
            <div className="px-5 py-4 border-t border-[var(--border)] flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded border border-[var(--border)] hover:bg-[var(--muted)]/30">취소</button>
              <button onClick={submit} disabled={sending || message.trim().length === 0}
                      className="px-4 py-2 rounded bg-[var(--accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? "저장 중…" : "제출"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
