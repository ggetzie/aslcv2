import moment from 'moment-timezone';
import AsyncStorage from '@react-native-community/async-storage';
import {StoredItems} from './StoredItem';
import {AxiosResponse} from 'axios';
import {
  SpatialArea,
  SpatialAreaQuery,
} from './EnumsAndInterfaces/SpatialAreaInterfaces';
import {Context} from './EnumsAndInterfaces/ContextInterfaces';
import store from '../../redux/store';

export async function getJwtFromAsyncStorage(): Promise<string> {
  return await AsyncStorage.getItem(StoredItems.JWT_TOKEN);
}

export async function getHeaders(lastModifiedDate?: number) {
  const jwt = await getJwtFromAsyncStorage();
  return {
    Authorization: jwt,
    'If-Modified-Since': moment(
      lastModifiedDate == null ? 0 : lastModifiedDate + 1000,
    )
      .tz('GMT')
      .format('ddd, DD MMM YYYY  HH:mm:ss z'),
  };
}

export async function extractAndSaveJwt(response: AxiosResponse) {
  const jwtToken = 'TOKEN ' + response.data.token;

  //TODO: Implement RefreshToken on backend
  const refreshToken = response.data.token;
  await AsyncStorage.setItem(StoredItems.JWT_TOKEN, jwtToken);
  await AsyncStorage.setItem(StoredItems.REFRESH_TOKEN, refreshToken);
}

export function getFilteredSpatialAreasQuery(
  spatialAreaQuery: SpatialAreaQuery,
): string {
  if (spatialAreaQuery == null) {
    return '';
  }
  const params: string[] = [];

  if (spatialAreaQuery.utm_zone) {
    params.push(`utm_zone=${spatialAreaQuery.utm_zone}`);
  }
  if (spatialAreaQuery.utm_hemisphere) {
    params.push(`utm_hemisphere=${spatialAreaQuery.utm_hemisphere}`);
  }
  if (spatialAreaQuery.area_utm_easting_meters) {
    params.push(
      `area_utm_easting_meters=${spatialAreaQuery.area_utm_easting_meters}`,
    );
  }
  if (spatialAreaQuery.area_utm_northing_meters) {
    params.push(
      `area_utm_northing_meters=${spatialAreaQuery.area_utm_northing_meters}`,
    );
  }
  const paramString = params.join('&');

  if (isNotEmptyOrNull(paramString)) {
    return '?' + paramString;
  } else {
    return '';
  }
}

export function isNotEmptyOrNull(val: string) {
  return val != null && val != '' && val.trim() != '';
}

export function isNotEmptyOrNullBatch(...args: string[]) {
  let safe = true;
  args.forEach((str) => {
    if (!isNotEmptyOrNull(str)) {
      safe = false;
    }
  });
  return safe;
}

export function batchJoinOperator(
  separator: string,
  ...args: string[]
): string {
  return args.join(separator);
}

export function getAreaStringFromArea(area: any): string {
  if (area == null) {
    return '';
  }
  return batchJoinOperator(
    '.',
    area.utm_hemisphere,
    area.utm_zone.toString(),
    area.area_utm_easting_meters.toString(),
    area.area_utm_northing_meters.toString(),
  );
}

export function getContextStringFromContext(context: Context): string {
  if (context == null) {
    return '';
  }
  return getAreaStringFromArea(context) + '.' + context.context_number;
}

export function getAreaStringForSelectedArea(): string {
  const selectedAreaId: string = store.getState().reducer.selectedSpatialAreaId;
  const spatialAreaIdToSpatialAreaMap: Map<string, SpatialArea> =
    store.getState().reducer.spatialAreaIdToSpatialAreaMap;
  return getAreaStringFromArea(
    spatialAreaIdToSpatialAreaMap.get(selectedAreaId),
  );
}

export function getContextAreaStringForSelectedContext(): string {
  const selectedContextId: string = store.getState().reducer.selectedContextId;
  const contextIdToContextMap: Map<string, Context> =
    store.getState().reducer.contextIdToContextMap;
  return getContextStringFromContext(
    contextIdToContextMap.get(selectedContextId),
  );
}

export function getFormattedDate(datetime: string): string {
  if (!isNotEmptyOrNull(datetime)) {
    return datetime;
  }
  return new Date(datetime.substr(0, datetime.length - 4) + 'Z')
    .toLocaleString()
    .toString();
}

export function reverseDateFormatting(datetime: string): string {
  if (!isNotEmptyOrNull(datetime)) {
    return datetime;
  }
  return datetime.substr(0, datetime.length - 1) + '000Z';
}

export function renderDate(date: string): string {
  if (!isNotEmptyOrNull(date)) {
    return 'Unset';
  }
  return date;
}

export function getDateFromISO(datetime: string): string {
  if (!isNotEmptyOrNull(datetime)) {
    return datetime;
  }
  return datetime.slice(0, 10);
}

export function enumToArray<T>(enumme): T[] {
  return Object.keys(enumme).map((key) => enumme[key]);
}
