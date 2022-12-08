import Color, { ColorDisplayType } from '../Color';

export default class Swatch {
    readonly color: Color;
    readonly isSelected: boolean;
    readonly isShadeSelected: boolean;
    readonly isCopied: boolean;

    public static build(
        color: Color
    ): Swatch {
        return new Swatch(color, false, false, false);
    }

    public buildNewFromColor(color: Color): Swatch {
        if (color.equals(this.color)) return this;
        return new Swatch(color, this.isSelected, this.isShadeSelected, this.isCopied);
    }

    public buildNewFromDisplayAs(displayAs: ColorDisplayType): Swatch {
        if (this.color.displayAs == displayAs) return this;
        return new Swatch(this.color.buildNewFromDisplayType(displayAs), this.isSelected, this.isShadeSelected, this.isCopied);
    }

    public buildNewFromIsCopied(isCopied: boolean): Swatch {
        if (isCopied == this.isCopied) return this;
        return new Swatch(this.color, this.isSelected, this.isShadeSelected, isCopied);
    }

    public buildNewFromIsSelected(isSelected: boolean): Swatch {
        if (isSelected == this.isSelected && this.isShadeSelected == false) return this;
        return new Swatch(this.color, isSelected, false, this.isCopied);
    }

    public buildNewFromIsShadeSelected(isShadeSelected: boolean): Swatch {
        if (this.isSelected == false && isShadeSelected == this.isShadeSelected) return this;
        return new Swatch(this.color, false, isShadeSelected, this.isCopied);
    }

    public copy(): Swatch {
        return new Swatch(this.color, false, this.isShadeSelected || this.isSelected, false);
    }

    private constructor(
        color: Color,
        isSelected: boolean,
        isShadeSelected: boolean,
        isCopied: boolean,
    ) {
        this.color = color;
        this.isSelected = isSelected;
        this.isShadeSelected = isShadeSelected;
        this.isCopied = isCopied;
    }
}