export type Styles = {
  'app': string;
  'appHeader': string;
  'appLink': string;
  'appLogo': string;
  'appLogoSpin': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
