export type Styles = {
  'borderBox': string;
  'colorContainer': string;
  'colorContainerLeftBottomRight': string;
  'colorContainerLeftRight': string;
  'colorContainerTopBottom': string;
  'colorContainerTopBottomRight': string;
  'colorContainerTopLeftBottom': string;
  'colorContainerTopLeftBottomRight': string;
  'colorContainerTopLeftRight': string;
  'colorSwatch': string;
  'copyBorder': string;
  'dark': string;
  'horizontalBottom': string;
  'horizontalTop': string;
  'light': string;
  'verticalLeft': string;
  'verticalRight': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
