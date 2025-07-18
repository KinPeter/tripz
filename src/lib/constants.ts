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

export const numberFormatOptions: Intl.NumberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  useGrouping: true,
};

export const monthNames: Record<string, string> = {
  '0': 'January',
  '1': 'February',
  '2': 'March',
  '3': 'April',
  '4': 'May',
  '5': 'June',
  '6': 'July',
  '7': 'August',
  '8': 'September',
  '9': 'October',
  '10': 'November',
  '11': 'December',
};

export const dayNames: Record<string, string> = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
};

export const ValidationError = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_LOGIN_CODE: 'INVALID_LOGIN_CODE',
  STRING_REQUIRED: 'STRING_REQUIRED',
  NUMBER_REQUIRED: 'NUMBER_REQUIRED',
  ARRAY_REQUIRED: 'ARRAY_REQUIRED',
  OBJECT_REQUIRED: 'OBJECT_REQUIRED',
  BOOLEAN_REQUIRED: 'BOOLEAN_REQUIRED',
  NULLABLE_FIELD_REQUIRED: 'NULLABLE_FIELD_REQUIRED',
  TEXT_OR_LINK_REQUIRED: 'TEXT_OR_LINK_REQUIRED',
  MIN_LENGTH: 'MIN_LENGTH',
  MAX_LENGTH: 'MAX_LENGTH',
  EXACT_LENGTH: 'EXACT_LENGTH',
  MIN_VALUE: 'MIN_VALUE',
  MAX_VALUE: 'MAX_VALUE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_TIME: 'INVALID_TIME',
  INVALID_URL: 'INVALID_URL',
  INVALID_CATEGORY: 'INVALID_CATEGORY',
  INVALID_UUID: 'INVALID_UUID',
  INVALID_LINK: 'INVALID_LINK',
  NOT_SUPPORTED_VALUE: 'NOT_SUPPORTED_VALUE',
} as const;

export type ValidationError = (typeof ValidationError)[keyof typeof ValidationError];
