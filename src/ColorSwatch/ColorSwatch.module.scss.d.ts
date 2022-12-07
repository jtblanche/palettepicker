export type Styles = {
  'colorSwatch': string;
  'copyBorder': string;
  'copyBorderLight': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
