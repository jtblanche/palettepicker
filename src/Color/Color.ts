import tinycolor, { ColorFormats } from 'tinycolor2';
import Settings from '../Settings';

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

interface RGB {
    r: number;
    g: number;
    b: number;
}

export default class Color {
    readonly tinycolor: tinycolor.Instance;
    private _rgb: ColorFormats.RGB | null;
    private _rgbString: string | null;
    private _prgb: ColorFormats.PRGB | null;
    private _prgbString: string | null;
    private _hsl: ColorFormats.HSL | null;
    private _hslString: string | null;
    private _hsv: ColorFormats.HSV | null;
    private _hsvString: string | null;
    private _hex: string | null;
    private _luminance: number | null;
    private _brightnessHex: string | null;
    private _isDark: boolean | null;
    private _backgroundColor: string | null = null;
    private _outputString: string | null = null;
    readonly lastLockedHue: number;
    readonly lastLockedSaturation: number;
    readonly lastLockedValue: number;
    readonly lastLockedLightness: number;

    public static build(colorInput: tinycolor.ColorInput): Color {
        return new Color(new tinycolor(colorInput));
    }

    public buildNewFromHue(updateTo: Color): Color {
        return new Color(new tinycolor({
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
            return new Color(newColor,
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
        return new Color(newColor,
            this.lastLockedHue,
            lastLockedSaturation,
            lastLockedValue,
            lastLockedLightness);
    }

    private constructor(
        color: tinycolor.Instance
    );
    private constructor(
        color: tinycolor.Instance,
        lastLockedHue: number | null,
        lastLockedSaturation: number | null,
        lastLockedValue: number | null,
        lastLockedLightness: number | null
    );
    private constructor(
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
        luminance: number | null,
        isDark: boolean | null,
    )
    private constructor(
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
        luminance?: number | null,
        isDark?: boolean | null,
    ) {
        this.tinycolor = color;
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
        this._luminance = luminance ?? null;
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

    private toRgbPercent(): RGB {
        return {
            r: this.rgb.r / 255,
            g: this.rgb.g / 255,
            b: this.rgb.b / 255,
        };
    }

    private toRgbLinear(): RGB {
        const rgbPercent = this.toRgbPercent();
        return {
            r: this.percentToLinear(rgbPercent.r),
            g: this.percentToLinear(rgbPercent.g),
            b: this.percentToLinear(rgbPercent.b),
        };
    }

    private percentToLinear(channel: number): number {
        if (channel <= 0.4045) {
            return channel / 12.92;
        }
        return Math.pow((channel + 0.055) / 1.055, 2.4);
    }

    public get luminance(): number {
        return this._luminance ?? this.toLuminance();
    }

    private toLuminance(): number {
        const rgbLinear = this.toRgbLinear();
        this._luminance = (0.2126 * rgbLinear.r) + (0.7152 * rgbLinear.g) + (0.0722 * rgbLinear.b);
        return this._luminance;
    }

    public toPerceivedLightnessPercent(): number {
        const luminance = this.toLuminance();
        if (luminance <= (216 / 24389)) {
            return (luminance * (24389 / 27)) / 100;
        }
        return (Math.pow(luminance, (1 / 3)) * 116 - 16) / 100;
    }

    private toPerceivedLightnessValue(): number {
        return this.toPerceivedLightnessPercent() * 255;
    }

    private toBrightnessHex(): string {
        const brightness = this.toPerceivedLightnessValue();
        const brightColor = tinycolor({
            r: brightness,
            g: brightness,
            b: brightness
        });
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

    public toBackgroundColor(settings: Settings): string {
        switch (settings.displayAs) {
            case ColorDisplayType.Brightness:
                this._backgroundColor = this.brightnessHex;
                break;
            default:
                this._backgroundColor = this.hex;
        }
        return this._backgroundColor!;
    }

    public toString(settings: Settings): string {
        switch (settings.displayAs) {
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

    public equals(other: Color): boolean {
        return this.hex === other.hex;
    }
}