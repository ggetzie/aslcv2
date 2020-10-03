export interface SpatialAreaQuery {
    utm_hemisphere: string;
    utm_zone: number;
    area_utm_easting_meters: number;
    area_utm_northing_meters: number;
}

export interface SpatialArea extends SpatialAreaQuery{
    id: string;
    // TODO: Fix Interface
    spatialcontext_set: any[]
}

export const initSpatialArea = (): SpatialAreaQuery => {
    return {
        utm_hemisphere: null,
        utm_zone: null,
        area_utm_easting_meters: null,
        area_utm_northing_meters: null
    }
};
