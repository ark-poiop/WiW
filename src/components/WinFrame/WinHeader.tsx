import React, { useState } from 'react';
import { X, ChevronDown, Globe } from 'lucide-react';
import type { Win } from '../../app/types';
import { PRESET_SIZES } from '../../app/types';
import { useAppStore } from '../../app/store';

interface WinHeaderProps {
  window: Win;
}

export const WinHeader: React.FC<WinHeaderProps> = ({ window: winData }) => {
  const [showPresets, setShowPresets] = useState(false);
  const { updateWindow, removeWindow, bringToFront } = useAppStore();

  const handlePresetSelect = (preset: typeof PRESET_SIZES[0]) => {
    updateWindow(winData.id, {
      w: preset.width,
      h: preset.height,
    });
    setShowPresets(false);
  };

  const handleClose = () => {
    removeWindow(winData.id);
  };

  const handleHeaderClick = () => {
    bringToFront(winData.id);
  };

  // 도메인 추출
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomain(winData.url);
  const displayTitle = winData.title || domain;

  return (
    <div 
      className="h-9 px-3 flex items-center justify-between rounded-t-xl border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur cursor-move select-none"
      onClick={handleHeaderClick}
    >
      {/* 좌측: 파비콘 + 타이틀 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-4 w-4 rounded bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
          <Globe size={12} className="text-white" />
        </div>
        <div className="text-sm text-[var(--text)] truncate max-w-[200px]">
          {displayTitle}
        </div>
      </div>

      {/* 우측: 프리셋 + 닫기 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* 프리셋 드롭다운 */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPresets(!showPresets);
            }}
            className="h-7 px-2 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center gap-1 text-xs border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
          >
            {winData.w}×{winData.h}
            <ChevronDown size={12} />
          </button>
          
          {showPresets && (
            <div className="absolute top-full right-0 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-10 min-w-[120px]">
              {PRESET_SIZES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePresetSelect(preset);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--muted)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ${
                    winData.w === preset.width && winData.h === preset.height
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text)]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="h-7 w-7 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center justify-center text-[var(--text)]"
          title="Close Window"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
