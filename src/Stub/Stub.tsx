import Color, { ColorDisplayType } from '../Color';
import Swatch from '../Swatch';

interface StubFlags {
    isHorizontal: boolean;
    isHueLocked: boolean;
}

export default class Stub {
    readonly swatches: Array<Swatch>;
    readonly displayAs: ColorDisplayType;
    readonly isHorizontal: boolean;
    readonly isSelected: boolean;
    // number for selected or shadeSelected based on isSelected
    readonly selectedIndex: number | null;
    readonly isHueLocked: boolean;

    public static build(swatches: Array<Swatch>, displayAs: ColorDisplayType, { isHorizontal, isHueLocked }: StubFlags): Stub {
        return new Stub(swatches, displayAs, isHorizontal, isHueLocked);
    }

    // isSelected true updates isSelected false updates isShadeSelected
    // index = number index of selected or shade to update or null to make all false
    private buildNewFromIsSelected(isSelected: boolean = false, index: number | null = null): Stub {
        if (this.isSelected == isSelected && this.selectedIndex == index) return this;
        let newSwatches = [...this.swatches];
        if (isSelected) {
            newSwatches = newSwatches.map(
                (swatch, i) => swatch.buildNewFromIsSelected(index == i)
            );
        } else {
            newSwatches = newSwatches.map(
                (swatch, i) => swatch.buildNewFromIsShadeSelected(index == i)
            );
        }
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, isSelected, index);
    }

    public buildNewFromDisplayAs(displayAs: ColorDisplayType): Stub {
        let newSwatches = [...this.swatches];
        newSwatches = newSwatches.map((swatch) => swatch.buildNewFromDisplayAs(displayAs));
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromIsHorizontal(isHorizontal: boolean): Stub {
        if (this.isHorizontal == isHorizontal) return this;
        return new Stub(this.swatches, this.displayAs, isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromIsHueLocked(isHueLocked: boolean): Stub {
        if (this.isHueLocked == isHueLocked) return this;
        return new Stub(this.swatches, this.displayAs, this.isHorizontal, isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromDeselectAll(): Stub {
        return this.buildNewFromIsSelected();
    }

    public buildNewFromShadeIndex(index: number): Stub {
        return this.buildNewFromIsSelected(false, index);
    }

    public buildNewFromSelectedIndex(index: number): Stub {
        return this.buildNewFromIsSelected(true, index);
    }

    public buildNewFromIsCopied(index: number, isCopied: boolean): Stub {
        const newSwatches = [...this.swatches];
        newSwatches[index] = newSwatches[index].buildNewFromIsCopied(isCopied);
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromSwatchColor(index: number, color: Color) {
        const newSwatches = [...this.swatches];
        newSwatches[index] = newSwatches[index].buildNewFromColor(color);
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromHueAndSV(index: number, color: Color): Stub {
        if (!this.isHueLocked) return this.buildNewFromSwatchColor(index, color);
        let newSwatches = [...this.swatches];

        newSwatches = newSwatches.map((swatch, i) => (index == i)
            ? swatch.buildNewFromColor(color)
            : swatch.buildNewFromColor(swatch.color.buildNewFromHue(color)));
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromHue(index: number, color: Color): Stub {
        if (!this.isHueLocked) return this.buildNewFromSwatchColor(index, this.swatches[index].color.buildNewFromHue(color));

        let newSwatches = [...this.swatches];
        newSwatches = newSwatches.map((swatch) =>
            swatch.buildNewFromColor(swatch.color.buildNewFromHue(color)));
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    public buildNewFromSV(index: number, color: Color): Stub {
        const newSwatches = [...this.swatches];
        const swatch = newSwatches[index];
        newSwatches[index] = swatch.buildNewFromColor(swatch.color.buildNewFromSaturationAndValue(color));
        return new Stub(newSwatches, this.displayAs, this.isHorizontal, this.isHueLocked, this.isSelected, this.selectedIndex);
    }

    private constructor(
        swatches: Array<Swatch>,
        displayAs: ColorDisplayType,
        isHorizontal: boolean,
        isHueLocked: boolean,
        isSelected: boolean = false,
        selectedIndex: number | null = null,
    ) {
        this.swatches = [...swatches];
        this.displayAs = displayAs;
        this.isHorizontal = isHorizontal;
        this.isHueLocked = isHueLocked;
        this.isSelected = isSelected;
        this.selectedIndex = selectedIndex;
    }
}