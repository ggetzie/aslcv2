export interface SpatialAreaQuery {
  utm_hemisphere: string;
  utm_zone: number;
  area_utm_easting_meters: number;
  area_utm_northing_meters: number;
}

export interface SpatialArea extends SpatialAreaQuery {
  id: string;
  // TODO: Fix Interface
  spatialcontext_set: any[];
}

export const initSpatialArea = (): SpatialAreaQuery => {
  return {
    utm_hemisphere: 'N',
    utm_zone: 38,
    area_utm_easting_meters: null,
    area_utm_northing_meters: null,
  };
};

export type UTM_Hemisphere = 'N' | 'S';

export const hemisphereList = ['N', 'S'];

export type UTMCoordinates = {
  hemisphere: UTM_Hemisphere;
  zone: number;
  easting: number;
  northing: number;
};
