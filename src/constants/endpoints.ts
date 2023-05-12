import { UTM_Hemisphere } from "./EnumsAndInterfaces/SpatialAreaInterfaces";

const API_ENDPOINTS = {
  // Spatial Area endpoints
  Area_ListAll: 'api/area/',
  Area_ListH: (hemisphere:  UTM_Hemisphere) => `api/area/${hemisphere}/`,
  Area_ListHZ: (hemisphere:  UTM_Hemisphere, zone: number) =>
    `api/area/${hemisphere}/${zone}/`,
  Area_ListHZE: (hemisphere:  UTM_Hemisphere, zone: number, easting: number) =>
    `api/area/${hemisphere}/${zone}/${easting}/`,
  Area_ListHZEN: (
    hemisphere:  UTM_Hemisphere,
    zone: number,
    easting: number,
    northing: number,
  ) => `api/area/${hemisphere}/${zone}/${easting}/${northing}/`,
  Area_DetailById: (areaID: string) => `api/area/${areaID}/`,
  Area_ListTypes: 'api/area/types/',

  // Spatial Context endpoints
  Context_ListAll: 'api/context/',
  Context_ListHZEN: (
    hemisphere:  UTM_Hemisphere,
    zone: number,
    easting: number,
    northing: number,
  ) =>
    `api/context?utm_hemisphere=${hemisphere}&utm_zone=${zone}&area_utm_easting_meters=${easting}&area_utm_northing_meters=${northing}`,
  Context_DetailById: (contextID: string) => `api/context/${contextID}/`,
  Context_PhotoUpload: (contextID: string) => `api/context/${contextID}/photo/`,
  Context_BagPhotoUpload: (contextID: string) =>
    `api/context/${contextID}/bagphoto/`,
  Context_ListTypes: 'api/context/types/',
  Login: 'auth-token/',
};

function join_url(parts: string[]): string {
  let result = '';
  for (let part of parts) {
    if (result.slice(-1) === '/' && part[0] === '/') {
      result += part.slice(1);
    } else if (result !== '' && result.slice(-1) !== '/' && part[0] !== '/') {
      result = result + '/' + part;
    } else {
      result += part;
    }
  }
  return result;
}
export {API_ENDPOINTS, join_url};
