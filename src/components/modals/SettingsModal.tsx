import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, ZoomIn, ZoomOut, Save, FolderOpen, Download, Upload, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { setTheme } from '../../app/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { workspace, setZoom, setTheme: setStoreTheme, saveWorkspace, loadWorkspace } = useAppStore();
  const [localZoom, setLocalZoom] = useState(workspace.zoom);
  const [localTheme, setLocalTheme] = useState(workspace.theme);
  const [gridSize, setGridSize] = useState(8);
  const [showGridGuide, setShowGridGuide] = useState(true);
  const [snapIntensity, setSnapIntensity] = useState<'weak' | 'medium' | 'strong'>('medium');

  useEffect(() => {
    if (isOpen) {
      setLocalZoom(workspace.zoom);
      setLocalTheme(workspace.theme);
    }
  }, [isOpen, workspace.zoom, workspace.theme]);

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

  const handleZoomChange = (newZoom: number) => {
    setLocalZoom(newZoom);
    setZoom(newZoom);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setLocalTheme(newTheme);
    setStoreTheme(newTheme);
    setTheme(newTheme);
  };

  const handleSave = () => {
    saveWorkspace();
  };

  const handleLoad = () => {
    loadWorkspace();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(workspace, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wiw-workspace-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedWorkspace = JSON.parse(event.target?.result as string);
        // TODO: Import workspace logic
        console.log('Imported workspace:', importedWorkspace);
      } catch (error) {
        console.error('Failed to parse imported file:', error);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] rounded-2xl shadow-xl ring-1 ring-[var(--border)]/50 max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]/50">
          <h2 className="text-lg font-semibold text-[var(--text)]">Settings</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={18} className="text-[var(--text)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Theme Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] uppercase tracking-wide">Theme</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                  localTheme === 'light'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] hover:bg-[var(--muted)]/30'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                  localTheme === 'dark'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] hover:bg-[var(--muted)]/30'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          {/* Zoom Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] uppercase tracking-wide">Zoom</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Current: {Math.round(localZoom * 100)}%</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleZoomChange(Math.max(0.5, localZoom - 0.1))}
                    className="h-7 w-7 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center justify-center"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={() => handleZoomChange(1)}
                    className="h-7 px-2 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition text-sm"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => handleZoomChange(Math.min(1.5, localZoom + 0.1))}
                    className="h-7 w-7 rounded-md hover:bg-[var(--muted)]/30 active:scale-[.98] transition flex items-center justify-center"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={localZoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Grid & Snap Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] uppercase tracking-wide">Grid & Snap</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Grid Size</span>
                <div className="flex gap-1">
                  {[8, 12, 16].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`h-7 px-2 rounded-md transition ${
                        gridSize === size
                          ? 'bg-[var(--accent)] text-white'
                          : 'border border-[var(--border)] hover:bg-[var(--muted)]/30'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Show Grid Guide</span>
                <button
                  onClick={() => setShowGridGuide(!showGridGuide)}
                  className={`h-6 w-11 rounded-full transition-colors ${
                    showGridGuide ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    showGridGuide ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Snap Intensity</span>
                <select
                  value={snapIntensity}
                  onChange={(e) => setSnapIntensity(e.target.value as 'weak' | 'medium' | 'strong')}
                  className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm"
                >
                  <option value="weak">Weak</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workspace Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] uppercase tracking-wide">Workspace</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/30 active:scale-[.98] transition"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleLoad}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/30 active:scale-[.98] transition"
              >
                <FolderOpen size={16} />
                Load
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/30 active:scale-[.98] transition"
              >
                <Download size={16} />
                Export
              </button>
              <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/30 active:scale-[.98] transition cursor-pointer">
                <Upload size={16} />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Policy Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--text)] uppercase tracking-wide">Information</h3>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Show policy info
                console.log('Show policy info');
              }}
            >
              <ExternalLink size={14} />
              Embedding Restrictions Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
