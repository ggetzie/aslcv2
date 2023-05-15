import {SpatialAreaQuery, UTM_Hemisphere} from './SpatialAreaInterfaces';

export interface SpatialContext {
  spatial_area: SpatialAreaQuery | string;
  area_utm_hemisphere: UTM_Hemisphere;
  area_utm_zone: number;
  area_utm_easting_meters: number;
  area_utm_northing_meters: number;
  context_number: number;
  id: string;
  type: string;
  opening_date: string;
  closing_date: string;
  description: string;
  director_notes: string;
  contextphoto_set: PhotoDetails[];
  bagphoto_set: PhotoDetails[];
}

export interface ContextFormData {
  type: string;
  opening_date: string;
  closing_date: string;
  description: string;
}

export interface PhotoDetails {
  thumbnail_url: string;
  photo_url: string;
}

export enum Source {
  F = 'F',
  D = 'D',
}

export function renderSource(source: Source): string {
  switch (source) {
    case Source.D:
      return 'Drying';
    case Source.F:
      return 'In Field';
  }
}

export const defaultContextTypes = [
  'cleaning',
  'collapse',
  'feature',
  'fill',
  'find',
  'finds',
  'topsoil mix',
  'wall',
];
