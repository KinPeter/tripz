export const USER_KEY = 'tripz-user';

export type TileLayerData = { attribution: string; url: string };
export enum TileLayerKey {
  DARK = 'dark',
  LIGHT = 'light',
  DEFAULT = 'default',
}
export const TILE_LAYERS = {
  dark: {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  },
  light: {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  },
  default: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
};
