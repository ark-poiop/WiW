import { useEffect } from 'react';
import { useAppStore } from './store';

export const useKeyboardEvents = () => {
  const { workspace, selectedWindowId, updateWindow, setSelectedWindow } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc: 현재 창 포커스 해제
      if (e.key === 'Escape') {
        setSelectedWindow(null);
        return;
      }

      // 선택된 창이 없으면 무시
      if (!selectedWindowId) return;

      const selectedWindow = workspace.windows.find(w => w.id === selectedWindowId);
      if (!selectedWindow) return;

      // Shift + Arrow: 선택 창 미세 이동 (8px 그리드)
      if (e.shiftKey && e.key.startsWith('Arrow')) {
        e.preventDefault();
        
        const moveAmount = 8;
        let newX = selectedWindow.x;
        let newY = selectedWindow.y;

        switch (e.key) {
          case 'ArrowUp':
            newY = Math.max(0, selectedWindow.y - moveAmount);
            break;
          case 'ArrowDown':
            newY = selectedWindow.y + moveAmount;
            break;
          case 'ArrowLeft':
            newX = Math.max(0, selectedWindow.x - moveAmount);
            break;
          case 'ArrowRight':
            newX = selectedWindow.x + moveAmount;
            break;
        }

        updateWindow(selectedWindowId, { x: newX, y: newY });
      }

      // Ctrl + Wheel: 줌 변경
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        // 줌 변경 로직은 Settings 모달에서 처리
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [selectedWindowId, workspace.windows, updateWindow, setSelectedWindow]);
};
