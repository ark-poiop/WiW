import { useState } from 'react';
import { Rnd } from 'react-rnd';

export default function App() {
  const [isOpenUrlModalOpen, setIsOpenUrlModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [windows, setWindows] = useState<Array<{
    id: string, 
    url: string, 
    title: string,
    x: number,
    y: number,
    width: number,
    height: number
  }>>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleAddWindow = (url: string, title: string) => {
    const newWindow = {
      id: Date.now().toString(),
      url,
      title: title || url,
      x: Math.random() * 100 + 50, // 랜덤 X 위치
      y: Math.random() * 100 + 50, // 랜덤 Y 위치
      width: 800, // 기본 너비
      height: 600  // 기본 높이
    };
    setWindows(prev => [...prev, newWindow]);
    setIsOpenUrlModalOpen(false);
  };

  const handleRemoveWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };



  const handleSaveWorkspace = () => {
    const workspace = { windows, theme };
    localStorage.setItem('wiw-workspace', JSON.stringify(workspace));
    alert('워크스페이스가 저장되었습니다!');
  };

  const handleLoadWorkspace = () => {
    const saved = localStorage.getItem('wiw-workspace');
    if (saved) {
      const workspace = JSON.parse(saved);
      setWindows(workspace.windows || []);
      setTheme(workspace.theme || 'light');
      alert('워크스페이스가 불러와졌습니다!');
    } else {
      alert('저장된 워크스페이스가 없습니다.');
    }
  };

  return (
    <div className={`w-screen h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <main className={`w-full h-full overflow-hidden relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {/* 플랫폼 헤더 */}
        <div className={`absolute top-4 left-4 z-20 rounded-lg px-4 py-2 shadow-lg ${theme === 'dark' ? 'bg-gray-700/90 text-white' : 'bg-white/90 text-gray-800'} backdrop-blur-sm`}>
          <h1 className="text-lg font-semibold">Wiw Dashboard</h1>
        </div>

        {/* 실제 iframe 창들 */}
        {windows.map(window => (
          <Rnd
            key={window.id}
            default={{
              x: window.x,
              y: window.y,
              width: window.width,
              height: window.height,
            }}
            minWidth={400}
            minHeight={300}
            bounds="parent"
            className="z-10"
          >
            <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* 창 헤더 */}
              <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-800 truncate max-w-48">
                    {window.title}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveWindow(window.id)}
                  className="w-6 h-6 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              
              {/* iframe 내용 */}
              <div className="w-full h-full">
                <iframe
                  src={window.url}
                  title={window.title}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </div>
          </Rnd>
        ))}
      </main>

      {/* Open URL Modal */}
      {isOpenUrlModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">새 창 열기</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const url = formData.get('url') as string;
              const title = formData.get('title') as string;
              if (url) {
                handleAddWindow(url, title);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  URL *
                </label>
                <input
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  제목 (선택)
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="창 제목"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  창 열기
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenUrlModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">설정</h2>
            
            {/* 테마 설정 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">테마</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                >
                  라이트
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : theme === 'light' ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                >
                  다크
                </button>
              </div>
            </div>



            {/* 워크스페이스 관리 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">워크스페이스</label>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveWorkspace}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  저장
                </button>
                <button
                  onClick={handleLoadWorkspace}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                >
                  불러오기
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* FAB Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          aria-label="Open URL"
          title="Open URL"
          onClick={() => setIsOpenUrlModalOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="lucide lucide-plus text-white" aria-hidden="true">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
        </button>

        <button
          aria-label="Settings"
          title="Settings"
          onClick={() => setIsSettingsModalOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="lucide lucide-settings text-white" aria-hidden="true">
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
