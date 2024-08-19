import { useLayoutEffect } from 'react';

export const useFullScreenMap = () => {
  const toggleFullscreen = () => {
    const map = document.getElementById('map-container');
    if (!map) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().then();
    } else {
      map.requestFullscreen().then();
    }
  };

  useLayoutEffect(() => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    const listener = () => {
      const map = mapContainer.querySelector(':scope > div') as HTMLDivElement;
      if (!map) return;
      map.style.height = document.fullscreenElement ? '100vh' : '80vh';
    };
    mapContainer.addEventListener('fullscreenchange', listener);

    return () => {
      mapContainer.removeEventListener('fullscreenchange', listener);
    };
  }, []);

  return { toggleFullscreen };
};
