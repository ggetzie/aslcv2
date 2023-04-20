type utm_hemisphere = 'N' | 'S';

const API_ENDPOINTS = {
  // Spatial Area endpoints
  Area_ListAll: 'api/area/',
  Area_ListH: (hemisphere: utm_hemisphere) => `api/area/${hemisphere}/`,
  Area_ListHZ: (hemisphere: utm_hemisphere, zone: number) =>
    `api/area/${hemisphere}/${zone}/`,
  Area_ListHZE: (hemisphere: utm_hemisphere, zone: number, easting: number) =>
    `api/area/${hemisphere}/${zone}/${easting}/`,
  Area_ListHZEN: (
    hemisphere: utm_hemisphere,
    zone: number,
    easting: number,
    northing: number,
  ) => `api/area/${hemisphere}/${zone}/${easting}/${northing}/`,
  Area_DetailById: (areaID: string) => `api/area/${areaID}/`,
  Area_ListTypes: 'api/area/types/',

  // Spatial Context endpoints
  Context_ListAll: 'api/context/',
  Context_ListHZEN: (
    hemisphere: utm_hemisphere,
    zone: number,
    easting: number,
    northing: number,
  ) => `api/context/${hemisphere}/${zone}/${easting}/${northing}/`,
  Context_DetailById: (contextID: string) => `api/context/${contextID}/`,
  Context_PhotoUpload: (contextID: string) => `api/context/${contextID}/photo/`,
  Context_BagPhotoUpload: (contextID: string) =>
    `api/context/${contextID}/bagphoto/`,
  Context_ListTypes: 'api/context/types/',
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
