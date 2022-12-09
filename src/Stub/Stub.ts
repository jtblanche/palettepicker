import Color from '../Color';
import Swatch from '../Swatch';
import Settings from '../Settings';

interface ChangeFlags {
    isSaturationChange: boolean;
    isValueChange: boolean;
    isLightnessChange: boolean;
}

export default class Stub {
    readonly swatches: Array<Swatch>;

    public static build(swatches: Array<Swatch>): Stub {
        return new Stub(swatches);
    }

    public buildNewFromSwatchColor(index: number, color: Color) {
        const newSwatches = [...this.swatches];
        newSwatches[index] = newSwatches[index].buildNewFromColor(color);
        return new Stub(newSwatches);
    }

    public buildNewFromHueAndSV(index: number, color: Color, settings: Settings): Stub {
        if (!settings.isHueLocked) return this.buildNewFromSwatchColor(index, color);
        let newSwatches = [...this.swatches];

        newSwatches = newSwatches.map((swatch, i) => (index === i)
            ? swatch.buildNewFromColor(color)
            : swatch.buildNewFromColor(swatch.color.buildNewFromHue(color)));
        return new Stub(newSwatches);
    }

    public buildNewFromHue(index: number, color: Color, settings: Settings): Stub {
        if (!settings.isHueLocked) return this.buildNewFromSwatchColor(index, this.swatches[index].color.buildNewFromHue(color));

        let newSwatches = [...this.swatches];
        newSwatches = newSwatches.map((swatch) =>
            swatch.buildNewFromColor(swatch.color.buildNewFromHue(color)));
        return new Stub(newSwatches);
    }

    public buildNewFromAddShade(settings: Settings): Stub {
        let newSwatches = [...this.swatches];
        const prevLocation = settings.selectedLocation;
        const selectedOrEnd: number = prevLocation?.swatchIndex ?? (newSwatches.length - 1);
        if (selectedOrEnd !== -1) {
            newSwatches = [
                ...newSwatches.filter((_, index) => index <= selectedOrEnd).map((stub) => stub),
                newSwatches[selectedOrEnd].copy(),
                ...newSwatches.splice(selectedOrEnd + 1).map((stub) => stub)
            ]
        } else {
            const defaultColors = [
                "#951F27",
                "#EF5C5A",
                "#FFA7A5",
                "#FFEEEE"
            ];
            newSwatches = defaultColors.map(
                (hex: string): Swatch => {
                    const color = Color.build(hex);
                    return Swatch.build(color)
                }
            );
        }
        return new Stub(newSwatches);
    }

    public buildNewFromRemoveShade(settings: Settings): Stub {
        const prevLocation = settings.selectedLocation;
        let newSwatches = [...this.swatches];
        const selectedOrEnd: number = prevLocation?.swatchIndex ?? (newSwatches.length - 1);
        if (selectedOrEnd !== -1) {
            newSwatches = [
                ...newSwatches.filter((_, index) => index < selectedOrEnd).map((stub) => stub),
                ...newSwatches.splice(selectedOrEnd + 1).map((stub) => stub)
            ]
        }
        return new Stub(newSwatches);
    }


    public buildNewFromSVL(index: number, color: Color, changeFlags: ChangeFlags): Stub {
        const newSwatches = [...this.swatches];
        const swatch = newSwatches[index];
        newSwatches[index] = swatch.buildNewFromColor(swatch.color.buildNewFromSVL(color, changeFlags));
        return new Stub(newSwatches);
    }


    public copy(): Stub {
        return new Stub(this.swatches.map(swatch => swatch.copy()));
    }

    private constructor(
        swatches: Array<Swatch>,
    ) {
        this.swatches = [...swatches];
    }
}