export type Styles = {
  'borderBox': string;
  'colorContainer': string;
  'colorContainerHorizontalEdge': string;
  'colorContainerSelected': string;
  'colorContainerVerticalEdge': string;
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
