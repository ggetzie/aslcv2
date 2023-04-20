import {SpatialAreaQuery} from './SpatialAreaInterfaces';

export interface Context {
  spatial_area: SpatialAreaQuery | string;
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
