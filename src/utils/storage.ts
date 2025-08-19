import type { Workspace } from '../app/types';

const WORKSPACE_STORAGE_KEY = 'wiw:workspace:default';

export const saveWorkspace = (workspace: Workspace): void => {
  try {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
  } catch (error) {
    console.error('Failed to save workspace:', error);
  }
};

export const loadWorkspace = (): Workspace | null => {
  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!stored) return null;
    
    const workspace = JSON.parse(stored) as Workspace;
    
    // 기본값 검증 및 보정
    return {
      workspaceId: workspace.workspaceId || 'default',
      name: workspace.name || 'Default Workspace',
      zoom: Math.max(0.5, Math.min(1.5, workspace.zoom || 1)),
      theme: workspace.theme || 'light',
      windows: workspace.windows || [],
    };
  } catch (error) {
    console.error('Failed to load workspace:', error);
    return null;
  }
};

export const clearWorkspace = (): void => {
  try {
    localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear workspace:', error);
  }
};
