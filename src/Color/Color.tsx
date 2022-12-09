import tinycolor, { ColorFormats } from 'tinycolor2';

export enum ColorDisplayType {
    Hex,
    RGB,
    PRGB,
    HSL,
    HSV,
    Brightness,
}

interface ChangeFlags {
    isSaturationChange: boolean;
    isValueChange: boolean;
    isLightnessChange: boolean;
}

export default class Color {
    readonly tinycolor: tinycolor.Instance;
    readonly displayAs: ColorDisplayType;
    private _rgb: ColorFormats.RGB | null;
    private _rgbString: string | null;
    private _prgb: ColorFormats.PRGB | null;
    private _prgbString: string | null;
    private _hsl: ColorFormats.HSL | null;
    private _hslString: string | null;
    private _hsv: ColorFormats.HSV | null;
    private _hsvString: string | null;
    private _hex: string | null;
    private _brightnessHex: string | null;
    private _isDark: boolean | null;
    private _backgroundColor: string | null = null;
    private _outputString: string | null = null;
    readonly lastLockedHue: number;
    readonly lastLockedSaturation: number;
    readonly lastLockedValue: number;
    readonly lastLockedLightness: number;

    public static build(displayAs: ColorDisplayType, colorInput: tinycolor.ColorInput): Color {
        return new Color(displayAs, new tinycolor(colorInput));
    }

    public buildNewFromDisplayType(displayAs: ColorDisplayType): Color {
        return new Color(
            displayAs,
            this.tinycolor,
            this.lastLockedHue,
            this.lastLockedSaturation,
            this.lastLockedValue,
            this.lastLockedLightness,
            this._rgb,
            this._rgbString,
            this._prgb,
            this._prgbString,
            this._hsl,
            this._hslString,
            this._hsv,
            this._hsvString,
            this._hex,
            this._brightnessHex,
            this._isDark,
        )
    }

    public buildNewFromHue(updateTo: Color): Color {
        return new Color(this.displayAs, new tinycolor({
            h: updateTo.hsv.h,
            s: this.hsv.s,
            v: this.hsv.v
        }),
            updateTo.hsv.h,
            this.lastLockedSaturation,
            this.lastLockedValue,
            this.lastLockedLightness);
    }

    public buildNewFromSVL(updateTo: Color, { isSaturationChange = false, isValueChange = false, isLightnessChange = false }: ChangeFlags): Color {
        let lastLockedSaturation = this.lastLockedSaturation;
        if (isSaturationChange) {
            lastLockedSaturation = updateTo.hsv.s;
        }
        let lastLockedValue = this.lastLockedValue;
        if (isValueChange) {
            lastLockedValue = updateTo.hsv.v;
        }
        let lastLockedLightness = this.lastLockedLightness;
        if (isLightnessChange) {
            lastLockedLightness = updateTo.hsl.l;
        }

        if (isLightnessChange) {
            const newColor = new tinycolor({
                h: this.lastLockedHue,
                s: lastLockedSaturation,
                l: lastLockedLightness,
            });
            return new Color(this.displayAs, newColor,
                this.lastLockedHue,
                lastLockedSaturation,
                lastLockedValue,
                lastLockedLightness);
        }
        const newColor = new tinycolor({
            h: this.lastLockedHue,
            s: lastLockedSaturation,
            v: lastLockedValue,
        });
        return new Color(this.displayAs, newColor,
            this.lastLockedHue,
            lastLockedSaturation,
            lastLockedValue,
            lastLockedLightness);
    }

    private constructor(
        displayAs: ColorDisplayType,
        color: tinycolor.Instance
    );
    private constructor(
        displayAs: ColorDisplayType,
        color: tinycolor.Instance,
        lastLockedHue: number | null,
        lastLockedSaturation: number | null,
        lastLockedValue: number | null,
        lastLockedLightness: number | null
    );
    private constructor(
        displayAs: ColorDisplayType,
        color: tinycolor.Instance,
        lastLockedHue: number | null,
        lastLockedSaturation: number | null,
        lastLockedValue: number | null,
        lastLockedLightness: number | null,
        rgb: ColorFormats.RGB | null,
        rgbString: string | null,
        prgb: ColorFormats.PRGB | null,
        prgbString: string | null,
        hsl: ColorFormats.HSL | null,
        hslString: string | null,
        hsv: ColorFormats.HSV | null,
        hsvString: string | null,
        hex: string | null,
        brightnessHex: string | null,
        isDark: boolean | null,
    )
    private constructor(
        displayAs: ColorDisplayType,
        color: tinycolor.Instance,
        lastLockedHue?: number | null,
        lastLockedSaturation?: number | null,
        lastLockedValue?: number | null,
        lastLockedLightness?: number | null,
        rgb?: ColorFormats.RGB | null,
        rgbString?: string | null,
        prgb?: ColorFormats.PRGB | null,
        prgbString?: string | null,
        hsl?: ColorFormats.HSL | null,
        hslString?: string | null,
        hsv?: ColorFormats.HSV | null,
        hsvString?: string | null,
        hex?: string | null,
        brightnessHex?: string | null,
        isDark?: boolean | null,
    ) {
        this.tinycolor = color;
        this.displayAs = displayAs;
        this._rgb = rgb ?? null;
        this._rgbString = rgbString ?? null;
        this._prgb = prgb ?? null;
        this._prgbString = prgbString ?? null;
        this._hsl = hsl ?? null;
        this._hslString = hslString ?? null;
        this._hsv = hsv ?? null;
        this._hsvString = hsvString ?? null;
        this._hex = hex ?? null;
        this._brightnessHex = brightnessHex ?? null;
        this._isDark = isDark ?? null;
        this.lastLockedHue = lastLockedHue ?? this.hsv.h;
        this.lastLockedSaturation = lastLockedSaturation ?? this.hsv.s;
        this.lastLockedValue = lastLockedValue ?? this.hsv.v;
        this.lastLockedLightness = lastLockedLightness ?? this.hsl.l;
    }

    private toRgb(): ColorFormats.RGB {
        this._rgb = this.tinycolor.toRgb();
        return this._rgb!;
    }

    public get rgb(): ColorFormats.RGB {
        return this._rgb ?? this.toRgb();
    }

    private toRgbString(): string {
        this._rgbString = this.tinycolor.toRgbString();
        return this._rgbString!;
    }

    public get rgbString(): string {
        return this._rgbString ?? this.toRgbString();
    }

    private toPrgb(): ColorFormats.PRGB {
        this._prgb = this.tinycolor.toPercentageRgb();
        return this._prgb!;
    }

    public get prgb(): ColorFormats.PRGB {
        return this._prgb ?? this.toPrgb();
    }

    private toPrgbString(): string {
        this._prgbString = this.tinycolor.toPercentageRgbString();
        return this._prgbString!;
    }

    public get prgbString(): string {
        return this._prgbString ?? this.toPrgbString();
    }

    private toHsl(): ColorFormats.HSL {
        this._hsl = this.tinycolor.toHsl();
        return this._hsl!;
    }

    public get hsl(): ColorFormats.HSL {
        return this._hsl ?? this.toHsl();
    }

    private toHslString(): string {
        this._hex = `#${this.tinycolor.toHex()}`;
        return this._hex!;
    }

    public get hslString(): string {
        return this._hslString ?? this.toHslString();
    }

    private toHsv(): ColorFormats.HSV {
        this._hsv = this.tinycolor.toHsv();
        return this._hsv!;
    }

    public get hsv(): ColorFormats.HSV {
        return this._hsv ?? this.toHsv();
    }

    private toHsvString(): string {
        this._hsvString = this.tinycolor.toHsvString();
        return this._hsvString!;
    }

    public get hsvString(): string {
        return this._hsvString ?? this.toHsvString();
    }

    private toHex(): string {
        this._hex = `#${this.tinycolor.toHex()}`;
        return this._hex!;
    }

    public get hex(): string {
        return this._hex ?? this.toHex();
    }

    private toBrightnessHex(): string {
        const brightness = (Math.sqrt(
            this.rgb.r * this.rgb.r * .241 +
            this.rgb.g * this.rgb.g * .691 +
            this.rgb.b * this.rgb.b * .068)).toFixed(0);
        const brightColor = tinycolor({
            r: brightness,
            g: brightness,
            b: brightness
        })
        this._brightnessHex = `#${brightColor.toHex()}`;
        return this._brightnessHex!;
    }

    public get brightnessHex(): string {
        return this._brightnessHex ?? this.toBrightnessHex();
    }

    private getIsDark(): boolean {
        const tinyColor = new tinycolor(this.brightnessHex);
        return tinyColor.toRgb().r < 130;
    }

    public get isDark(): boolean {
        return this._isDark ?? this.getIsDark();
    }

    private toBackgroundColor(): string {
        switch (this.displayAs) {
            case ColorDisplayType.Brightness:
                this._backgroundColor = this.brightnessHex;
                break;
            default:
                this._backgroundColor = this.hex;
        }
        return this._backgroundColor!;
    }

    public get backgroundColor(): string {
        return this._backgroundColor ?? this.toBackgroundColor();
    }

    private toOutputString(): string {
        switch (this.displayAs) {
            case ColorDisplayType.RGB:
                this._outputString = this.rgbString;
                break;
            case ColorDisplayType.PRGB:
                this._outputString = this.prgbString;
                break;
            case ColorDisplayType.HSL:
                this._outputString = this.hslString;
                break;
            case ColorDisplayType.HSV:
                this._outputString = this.hsvString;
                break;
            default:
                this._outputString = this.hex;
                break;
        }
        return this._outputString;
    }

    public toString(): string {
        return this._outputString ?? this.toOutputString();
    }

    public equals(other: Color): boolean {
        return this.hex === other.hex;
    }
}