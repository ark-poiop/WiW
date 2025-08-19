import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || ""; // 비워두면 동일 오리진(/api)

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function submit() {
    setSending(true);
    setOkMsg("");
    try {
      const r = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, message }),
      });
      const data = await r.json();
      if (data.ok) {
        setOkMsg("의견이 저장되었습니다.");
        setMessage(""); setRating(0);
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
        className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center text-white fixed right-6 bottom-40 z-50"
      >
        ✉️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* 헤더 */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">💭</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">사용 후기</h3>
                  <p className="text-blue-100 text-sm">소중한 의견을 들려주세요</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-white text-lg">×</span>
              </button>
            </div>

            {/* 내용 */}
            <div className="p-6 space-y-6">
              {/* 별점 섹션 */}
              <div className="text-center space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    전체적으로 어떠셨나요?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    별점으로 평가해주세요
                  </p>
                </div>
                
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        rating >= star
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/25'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className={`text-xl ${rating >= star ? 'text-white' : 'text-gray-400'}`}>
                        ⭐
                      </span>
                    </button>
                  ))}
                </div>
                
                {rating > 0 && (
                  <div className="text-center animate-in fade-in duration-300">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {rating === 5 ? '🎉 최고예요!' : 
                       rating === 4 ? '😊 좋아요!' : 
                       rating === 3 ? '😐 보통이에요' : 
                       rating === 2 ? '😕 아쉬워요' : '😞 별로예요'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* 의견 입력 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  더 자세한 의견이 있다면... (선택사항)
                </label>
                <div className="relative">
                  <textarea 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="개선사항이나 좋았던 점을 알려주세요..."
                    rows={4}
                    maxLength={5000}
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {message.length}/5000
                  </div>
                </div>
              </div>
              
              {okMsg && (
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in duration-300">
                  <p className="text-green-700 dark:text-green-400 font-medium">✅ {okMsg}</p>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-3">
                <button 
                  onClick={() => setOpen(false)} 
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={submit} 
                  disabled={sending || rating === 0}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all disabled:cursor-not-allowed transform active:scale-95"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      전송 중...
                    </span>
                  ) : (
                    '💌 보내기'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
