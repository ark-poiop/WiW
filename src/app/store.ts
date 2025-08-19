import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Win, Workspace, Theme } from './types';
import { saveWorkspace, loadWorkspace } from '../utils/storage';

interface AppState {
  workspace: Workspace;
  selectedWindowId: string | null;
  maxZIndex: number;
}

interface AppActions {
  // 창 관리
  addWindow: (url: string, options?: Partial<Pick<Win, 'title' | 'w' | 'h' | 'aspectRatio'>>) => void;
  updateWindow: (id: string, patch: Partial<Win>) => void;
  removeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  
  // 줌 및 테마
  setZoom: (zoom: number) => void;
  setTheme: (theme: Theme) => void;
  
  // 선택 상태
  setSelectedWindow: (id: string | null) => void;
  
  // 저장/불러오기
  saveWorkspace: () => void;
  loadWorkspace: () => void;
  
  // 초기화
  initialize: () => void;
}

const ZOOM_LEVELS = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5];

const createDefaultWorkspace = (): Workspace => ({
  workspaceId: 'default',
  name: 'Default Workspace',
  zoom: 1,
  theme: 'light',
  windows: [],
});

export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    workspace: createDefaultWorkspace(),
    selectedWindowId: null,
    maxZIndex: 0,

    addWindow: (url: string, options = {}) => {
      set((state) => {
        const newZIndex = state.maxZIndex + 1;
        state.maxZIndex = newZIndex;
        
        const newWindow: Win = {
          id: `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: options.title || url,
          url,
          x: 50 + (state.workspace.windows.length * 30),
          y: 50 + (state.workspace.windows.length * 30),
          w: options.w || 360,
          h: options.h || 640,
          z: newZIndex,
          aspectRatio: options.aspectRatio || '9:16',
          deviceProfile: 'mobile-portrait',
        };
        
        state.workspace.windows.push(newWindow);
        state.selectedWindowId = newWindow.id;
      });
    },

    updateWindow: (id: string, patch: Partial<Win>) => {
      set((state) => {
        const window = state.workspace.windows.find(w => w.id === id);
        if (window) {
          Object.assign(window, patch);
        }
      });
    },

    removeWindow: (id: string) => {
      set((state) => {
        state.workspace.windows = state.workspace.windows.filter(w => w.id !== id);
        if (state.selectedWindowId === id) {
          state.selectedWindowId = null;
        }
      });
    },

    bringToFront: (id: string) => {
      set((state) => {
        const newZIndex = state.maxZIndex + 1;
        state.maxZIndex = newZIndex;
        
        const window = state.workspace.windows.find(w => w.id === id);
        if (window) {
          window.z = newZIndex;
        }
        
        state.selectedWindowId = id;
      });
    },

    setZoom: (zoom: number) => {
      set((state) => {
        // 줌 레벨을 가장 가까운 허용된 값으로 조정
        const closest = ZOOM_LEVELS.reduce((prev, curr) => 
          Math.abs(curr - zoom) < Math.abs(prev - zoom) ? curr : prev
        );
        state.workspace.zoom = closest;
      });
    },

    setTheme: (theme: Theme) => {
      set((state) => {
        state.workspace.theme = theme;
      });
    },

    setSelectedWindow: (id: string | null) => {
      set((state) => {
        state.selectedWindowId = id;
      });
    },

    saveWorkspace: () => {
      const { workspace } = get();
      saveWorkspace(workspace);
    },

    loadWorkspace: () => {
      const loaded = loadWorkspace();
      if (loaded) {
        set((state) => {
          state.workspace = loaded;
          // zIndex 재계산
          state.maxZIndex = Math.max(...loaded.windows.map(w => w.z), 0);
        });
      }
    },

    initialize: () => {
      const loaded = loadWorkspace();
      if (loaded) {
        set((state) => {
          state.workspace = loaded;
          state.maxZIndex = Math.max(...loaded.windows.map(w => w.z), 0);
        });
      }
    },
  }))
);
