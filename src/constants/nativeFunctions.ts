import {Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');

const guidelineBaseHeight = 812;
const guidelineBaseWidth = 375;
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;
export const horizontalScale = (size: number) =>
  (width / guidelineBaseWidth) * size;

export function validateEmail(email: string): boolean {
  const regExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
}

export function validatePassword(password: string): boolean {
  if (password == null) {
    return false;
  }

  const regExp = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.{8,})');
  return regExp.test(password);
}
