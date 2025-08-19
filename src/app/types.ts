export type DeviceProfile = 'mobile-portrait';
export type AspectRatio = '9:16';
export type Theme = 'light' | 'dark';

export interface Win {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  pinned?: boolean;
  refreshSec?: number | null;
  aspectRatio: AspectRatio;
  deviceProfile: DeviceProfile;
}

export interface Workspace {
  workspaceId: string;
  name: string;
  zoom: number;
  theme: Theme;
  windows: Win[];
}

export interface PresetSize {
  name: string;
  width: number;
  height: number;
}

export const PRESET_SIZES: PresetSize[] = [
  { name: '360×640', width: 360, height: 640 },
  { name: '390×844', width: 390, height: 844 },
  { name: '414×896', width: 414, height: 896 },
];
