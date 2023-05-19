import {AxiosResponse} from 'axios';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-community/async-storage';

import {StoredItems} from './StoredItem';
import {
  SpatialArea,
  SpatialAreaQuery,
} from './EnumsAndInterfaces/SpatialAreaInterfaces';
import {SpatialContext} from './EnumsAndInterfaces/ContextInterfaces';
import store from '../../redux/store';
import {Source} from './EnumsAndInterfaces/ContextInterfaces';
import {ContextChoice} from './EnumsAndInterfaces/ContextInterfaces';

export async function getJwtFromAsyncStorage(): Promise<string> {
  // return await AsyncStorage.getItem(StoredItems.JWT_TOKEN);
  return await AsyncStorage.getItem('authToken');
}

export async function getHeaders(lastModifiedDate?: number) {
  const token = await AsyncStorage.getItem('authToken');
  return {
    Authorization: `Token ${token}`,
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

export function getContextStringFromContext(context: SpatialContext): string {
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
  const contextIdToContextMap: Map<string, SpatialContext> =
    store.getState().reducer.contextIdToContextMap;
  return getContextStringFromContext(
    contextIdToContextMap.get(selectedContextId),
  );
}

export function getSpatialString(
  spatialArea: SpatialArea | null,
  spatialContext: SpatialContext | null,
): string {
  if (spatialArea === null) {
    return 'No Area Selected';
  }
  const areaString = `${spatialArea.utm_hemisphere}.${spatialArea.utm_zone}.${spatialArea.area_utm_easting_meters}.${spatialArea.area_utm_northing_meters}`;
  if (spatialContext === null) {
    return areaString;
  }
  return `${areaString}.${spatialContext.context_number}`;
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

export function getBagPhotoSource(url: string) {
  const parts = url.split('/');
  const bag_type = parts.slice(-2, -1)[0];
  if (['bag_dry', 'drying'].includes(bag_type)) {
    return Source.D;
  } else if (['bag_field', 'field'].includes(bag_type)) {
    return Source.F;
  } else {
    throw new Error('Unknown bag type: ' + bag_type);
  }
}

export const validateDates = (
  openingDateISO?: string,
  closingDateISO?: string,
): boolean => {
  const today = new Date();
  if (openingDateISO) {
    // always check that opening date is not more than a week in the future
    // as long as it's defined
    const openingDate = new Date(openingDateISO);
    const openingIsMoreThanAWeekAway =
      openingDate.getTime() - today.getTime() > 7 * 24 * 60 * 60 * 1000;
    if (openingIsMoreThanAWeekAway) {
      alert('Warning: Opening date is more than a week in the future!');
    }
    if (closingDateISO) {
      // if both opening and closing dates are defined, check that closing date is on or after opening date
      const closingDate = new Date(closingDateISO);
      const closingIsAfterOpening = closingDate >= openingDate;
      if (!closingIsAfterOpening) {
        alert("Closing date can't be before opening date");
        return false;
      }
    } else {
      // if only opening date is defined, return true
      return true;
    }
  } else {
    if (closingDateISO) {
      // can't have a closing date with no opening date
      alert('Closing date can only be set if opening date is set');
      return false;
    } else {
      // if neither opening nor closing dates are defined, return true
      return true;
    }
  }
  return true;
};

export const filterSpatialContextByChoice = (
  spatialContext: SpatialContext,
  choice: ContextChoice,
) => {
  switch (choice) {
    case ContextChoice.OPEN:
      return (
        spatialContext.opening_date !== null &&
        spatialContext.closing_date === null
      );
    case ContextChoice.UNUSED:
      return (
        spatialContext.opening_date === null &&
        spatialContext.closing_date === null
      );
    case ContextChoice.CLOSED:
      return spatialContext.closing_date !== null;
    case ContextChoice.ALL:
      return true;
  }
};

export function getDomain(url: string): string {
  // extract the domain from a url
  const re = /https?:\/\/([^\/]+)\//;
  const match = url.match(re);
  if (match && match.length > 1) {
    return match[1];
  } else {
    return '';
  }
}
