import Color, { ColorDisplayType } from '../Color';

export default class Swatch {
    readonly color: Color;
    readonly isSelected: boolean;
    readonly isShadeSelected: boolean;
    readonly isCopied: boolean;
    readonly isHorizontal: boolean;
    readonly isHueSelected: boolean;

    public static build(
        color: Color,
        isHorizontal: boolean,
    ): Swatch {
        return new Swatch(color, false, false, false, isHorizontal, false);
    }

    public buildNewFromColor(color: Color): Swatch {
        if (color.equals(this.color)) return this;
        return new Swatch(color, this.isSelected, this.isShadeSelected, this.isCopied, this.isHorizontal, this.isHueSelected);
    }

    public buildNewFromDisplayAs(displayAs: ColorDisplayType): Swatch {
        if (this.color.displayAs == displayAs) return this;
        return new Swatch(this.color.buildNewFromDisplayType(displayAs), this.isSelected, this.isShadeSelected, this.isCopied, this.isHorizontal, this.isHueSelected);
    }

    public buildNewFromIsCopied(isCopied: boolean): Swatch {
        if (isCopied == this.isCopied) return this;
        return new Swatch(this.color, this.isSelected, this.isShadeSelected, isCopied, this.isHorizontal, this.isHueSelected);
    }

    public buildNewFromSelectedStub(isSelected: boolean): Swatch {
        if (isSelected == this.isSelected && !this.isShadeSelected && this.isHueSelected == !isSelected) return this;
        return new Swatch(this.color, isSelected, false, this.isCopied, this.isHorizontal, !isSelected);
    }

    public buildNewFromDeselectedStub(isShadeSelected: boolean): Swatch {
        if (this.isSelected == false && !this.isHueSelected && isShadeSelected == this.isShadeSelected) return this;
        return new Swatch(this.color, false, isShadeSelected, this.isCopied, this.isHorizontal, false);
    }

    public buildNewFromIsHorizontal(isShadeSelected: boolean): Swatch {
        if (this.isSelected == false && isShadeSelected == this.isShadeSelected) return this;
        return new Swatch(this.color, this.isSelected, this.isShadeSelected, this.isCopied, this.isHorizontal, this.isHueSelected);
    }

    public copy(): Swatch {
        return new Swatch(this.color, false, this.isShadeSelected || this.isSelected, false, this.isHorizontal, false);
    }

    private constructor(
        color: Color,
        isSelected: boolean,
        isShadeSelected: boolean,
        isCopied: boolean,
        isHorizontal: boolean,
        isHueSelected: boolean,
    ) {
        this.color = color;
        this.isSelected = isSelected;
        this.isShadeSelected = isShadeSelected;
        this.isCopied = isCopied;
        this.isHorizontal = isHorizontal;
        this.isHueSelected = isHueSelected;
    }
}