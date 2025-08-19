import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import type { Win } from '../../app/types';

interface WinContentProps {
  window: Win;
}

export const WinContent: React.FC<WinContentProps> = ({ window: winData }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // iframe 로드 상태 초기화
    setIsLoading(true);
    setIsBlocked(false);
    setLoadError(null);
  }, [winData.url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    try {
      // iframe 접근 시도 (CORS 정책으로 차단될 수 있음)
      if (iframeRef.current?.contentWindow) {
        // 간단한 접근 테스트 - CORS 정책으로 인해 접근 불가할 수 있음
        setIsBlocked(false);
      }
    } catch (error) {
      // CORS 정책으로 인해 접근 불가
      setIsBlocked(true);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError('Failed to load content');
  };

  const openInNewTab = () => {
    globalThis.open(winData.url, '_blank');
  };

  if (isBlocked) {
    return (
      <div className="w-full h-full bg-[var(--surface)] flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h3 className="text-[var(--text)] font-medium mb-2">Embedding Blocked</h3>
        <p className="text-[var(--text)] text-sm opacity-70 mb-4">
          This website cannot be embedded due to security restrictions.
        </p>
        <button
          onClick={openInNewTab}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <ExternalLink size={16} />
          Open in New Tab
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full bg-[var(--surface)] flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h3 className="text-[var(--text)] font-medium mb-2">Load Error</h3>
        <p className="text-[var(--text)] text-sm opacity-70 mb-4">
          {loadError}
        </p>
        <button
          onClick={openInNewTab}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <ExternalLink size={16} />
          Open in New Tab
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[var(--surface)] relative">
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--surface)] flex items-center justify-center">
          <div className="text-[var(--text)] text-sm">Loading...</div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={winData.url}
        className="w-full h-full border-0"
        sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={winData.title || winData.url}
      />
    </div>
  );
};
