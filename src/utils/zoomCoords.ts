// 줌 좌표 변환 유틸리티
// Canvas에 transform: scale(zoom)이 적용된 상태에서
// react-rnd의 좌표를 올바르게 처리하기 위한 함수들

export const downscaleCoord = (coord: number, zoom: number): number => {
  return coord / zoom;
};

export const upscaleCoord = (coord: number, zoom: number): number => {
  return coord * zoom;
};

export const downscaleSize = (size: number, zoom: number): number => {
  return size / zoom;
};

export const upscaleSize = (size: number, zoom: number): number => {
  return size * zoom;
};

export const downscalePosition = (x: number, y: number, zoom: number) => ({
  x: downscaleCoord(x, zoom),
  y: downscaleCoord(y, zoom),
});

export const upscalePosition = (x: number, y: number, zoom: number) => ({
  x: upscaleCoord(x, zoom),
  y: upscaleCoord(y, zoom),
});

export const downscaleBounds = (x: number, y: number, w: number, h: number, zoom: number) => ({
  x: downscaleCoord(x, zoom),
  y: downscaleCoord(y, zoom),
  w: downscaleSize(w, zoom),
  h: downscaleSize(h, zoom),
});

export const upscaleBounds = (x: number, y: number, w: number, h: number, zoom: number) => ({
  x: upscaleCoord(x, zoom),
  y: upscaleCoord(y, zoom),
  w: upscaleSize(w, zoom),
  h: upscaleSize(h, zoom),
});
