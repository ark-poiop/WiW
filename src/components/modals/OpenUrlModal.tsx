import React, { useState, useEffect, useRef } from 'react';
import { X, Globe, Type, Monitor } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { PRESET_SIZES } from '../../app/types';

interface OpenUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenUrlModal: React.FC<OpenUrlModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(PRESET_SIZES[0]);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const { addWindow } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setTitle('');
      setSelectedPreset(PRESET_SIZES[0]);
      setIsUrlValid(true);
      // 모달이 열리면 URL 입력 필드에 포커스
      setTimeout(() => urlInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 스크롤 잠금
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsUrlValid(validateUrl(newUrl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUrlValid || !url.trim()) return;

    // URL 정규화 (http:// 추가)
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    addWindow(normalizedUrl, {
      title: title.trim() || normalizedUrl,
      w: selectedPreset.width,
      h: selectedPreset.height,
      aspectRatio: '9:16',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] rounded-2xl shadow-xl ring-1 ring-[var(--border)]/50 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]/50">
          <h2 className="text-lg font-semibold text-[var(--text)]">Open URL</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={18} className="text-[var(--text)]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
              <Globe size={16} />
              URL *
            </label>
            <input
              ref={urlInputRef}
              id="url"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isUrlValid 
                  ? 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20' 
                  : 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              } bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)]`}
              required
            />
            {!isUrlValid && url && (
              <p className="text-sm text-red-500">Please enter a valid URL (http:// or https://)</p>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
              <Type size={16} />
              Title (Optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Window title"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] transition-colors"
            />
          </div>

          {/* Preset Selection */}
          <div className="space-y-2">
            <label htmlFor="preset" className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
              <Monitor size={16} />
              Viewport Size
            </label>
            <select
              id="preset"
              value={`${selectedPreset.width}×${selectedPreset.height}`}
              onChange={(e) => {
                const preset = PRESET_SIZES.find(p => `${p.width}×${p.height}` === e.target.value);
                if (preset) setSelectedPreset(preset);
              }}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 bg-[var(--bg)] text-[var(--text)] transition-colors"
            >
              {PRESET_SIZES.map((preset) => (
                <option key={preset.name} value={`${preset.width}×${preset.height}`}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isUrlValid || !url.trim()}
            className="w-full py-2 px-4 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Open Window
          </button>
        </form>
      </div>
    </div>
  );
};
