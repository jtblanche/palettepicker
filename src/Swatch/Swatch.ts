import Color from '../Color';

export default class Swatch {
    readonly color: Color;

    public static build(
        color: Color,
    ): Swatch {
        return new Swatch(color);
    }

    public buildNewFromColor(color: Color): Swatch {
        if (color.equals(this.color)) return this;
        return new Swatch(color);
    }

    public copy(): Swatch {
        return new Swatch(this.color);
    }

    private constructor(
        color: Color,
    ) {
        this.color = color;
    }
}