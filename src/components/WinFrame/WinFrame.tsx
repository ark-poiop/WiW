import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { Win } from '../../app/types';
import { useAppStore } from '../../app/store';
import { WinHeader } from './WinHeader';
import { WinContent } from './WinContent';
import { downscaleBounds } from '../../utils/zoomCoords';

interface WinFrameProps {
  window: Win;
}

export const WinFrame: React.FC<WinFrameProps> = ({ window: winData }) => {
  const { updateWindow, bringToFront } = useAppStore();
  const [isAltPressed, setIsAltPressed] = useState(false);

  // Alt 키 상태 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    globalThis.addEventListener('keyup', handleKeyUp);
    
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      globalThis.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 줌이 적용된 상태에서 react-rnd 좌표 보정
  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    // react-rnd는 줌이 적용된 좌표를 반환하므로 downscale 필요
    const correctedPos = downscaleBounds(d.x, d.y, winData.w, winData.h, 1);
    
    updateWindow(winData.id, {
      x: correctedPos.x,
      y: correctedPos.y,
    });
  };

  const handleResizeStop = (_e: any, _direction: any, ref: any, _delta: any, position: any) => {
    // react-rnd는 줌이 적용된 좌표를 반환하므로 downscale 필요
    const correctedBounds = downscaleBounds(
      position.x,
      position.y,
      ref.style.width ? parseInt(ref.style.width) : winData.w,
      ref.style.height ? parseInt(ref.style.height) : winData.h,
      1
    );
    
    updateWindow(winData.id, {
      x: correctedBounds.x,
      y: correctedBounds.y,
      w: correctedBounds.w,
      h: correctedBounds.h,
    });
  };

  const handleClick = () => {
    bringToFront(winData.id);
  };

  const handleDragStart = () => {
    bringToFront(winData.id);
  };

  const handleResizeStart = () => {
    bringToFront(winData.id);
  };

  return (
    <Rnd
      size={{
        width: winData.w,
        height: winData.h,
      }}
      position={{
        x: winData.x,
        y: winData.y,
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onDragStart={handleDragStart}
      onResizeStart={handleResizeStart}
      onClick={handleClick}
      style={{
        zIndex: winData.z,
        display: 'flex',
        flexDirection: 'column',
      }}
      className="rounded-2xl shadow-lg ring-1 ring-[var(--border)]/50 bg-[var(--surface)] overflow-hidden"
      grid={isAltPressed ? undefined : [8, 8]} // Alt 키 누르면 스냅 해제
      minWidth={200}
      minHeight={300}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      resizeHandleStyles={{
        top: { cursor: 'ns-resize' },
        right: { cursor: 'ew-resize' },
        bottom: { cursor: 'ns-resize' },
        left: { cursor: 'ew-resize' },
        topRight: { cursor: 'ne-resize' },
        bottomRight: { cursor: 'se-resize' },
        bottomLeft: { cursor: 'sw-resize' },
        topLeft: { cursor: 'nw-resize' },
      }}
      resizeHandleClasses={{
        top: 'h-2 w-full',
        right: 'h-full w-2',
        bottom: 'h-2 w-full',
        left: 'h-full w-2',
        topRight: 'h-2 w-2',
        bottomRight: 'h-2 w-2',
        bottomLeft: 'h-2 w-2',
        topLeft: 'h-2 w-2',
      }}
    >
      <WinHeader window={winData} />
      <div className="flex-1 overflow-hidden rounded-b-2xl">
        <WinContent window={winData} />
      </div>
    </Rnd>
  );
};
