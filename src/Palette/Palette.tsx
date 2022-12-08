import { stepButtonClasses } from '@mui/material';
import { palette } from '@mui/system';
import Color, { ColorDisplayType } from '../Color';
import Stub from '../Stub';
import Swatch from '../Swatch';

export interface ColorLocation {
    stubIndex: number;
    swatchIndex: number;
}

export enum ColorChangeType {
    hue,
    sv,
    all
}

export default class Palette {
    readonly stubs: Array<Stub>;
    readonly isHorizontal: boolean;
    readonly isHueLocked: boolean;
    readonly isSVLocked: boolean;
    readonly displayAs: ColorDisplayType;
    readonly selectedLocation: ColorLocation | null;
    readonly globalColor: Color;
    public static copiedLocation: ColorLocation | null;
    public static copied: Color | null;

    public static build(
        hexStubs: Array<Array<string>>,
        isHorizontal: boolean,
        isHueLocked: boolean,
        isSVLocked: boolean,
        displayAs: ColorDisplayType
    ): Palette {
        const stubs = hexStubs.map(
            (stubStrings: Array<string>): Stub => {
                const swatches = stubStrings.map(
                    (hex: string): Swatch => {
                        const color = Color.build(displayAs, hex);
                        return Swatch.build(color)
                    }
                );
                return Stub.build(swatches, displayAs, { isHorizontal, isHueLocked });
            }
        );
        return new Palette(stubs, isHorizontal, isHueLocked, isSVLocked, displayAs, Color.build(displayAs, 'blue'), null);
    }

    public buildNewFromDeselection() {
        const newStubs = this.stubs.map((stub): Stub => {
            if (stub.selectedIndex == null) return stub;
            return stub.buildNewFromDeselectAll();
        });
        return new Palette(newStubs, this.isHorizontal, this.isHueLocked, this.isSVLocked, this.displayAs, this.globalColor, null);
    }

    public buildNewFromSelection({ stubIndex, swatchIndex }: ColorLocation) {
        // this.selectedLocation = { stubIndex, swatchIndex };
        const newStubs = this.stubs.map((stub, i): Stub => {
            const stubIsSelected = stubIndex == i;
            if ((stub.isSelected == stubIsSelected) && swatchIndex == stub.selectedIndex) return stub;
            return stubIsSelected
                ? stub.buildNewFromSelectedIndex(swatchIndex)
                : stub.buildNewFromShadeIndex(swatchIndex)
        });
        return new Palette(newStubs, this.isHorizontal, this.isHueLocked, this.isSVLocked, this.displayAs, this.getColor({ stubIndex, swatchIndex }), { stubIndex, swatchIndex });
    }

    public buildNewFromColor(color: Color, changeType: ColorChangeType) {
        let newStubs = this.stubs;
        if (this.selectedLocation != null) {
            const { stubIndex, swatchIndex } = this.selectedLocation!;
            newStubs = this.stubs.map((stub, i) => {
                switch (changeType) {
                    case ColorChangeType.hue:
                        return (i == stubIndex)
                            ? stub.buildNewFromHue(swatchIndex, color)
                            : stub;
                    case ColorChangeType.sv:
                        return (this.isSVLocked)
                            ? stub.buildNewFromSV(swatchIndex, color)
                            : (i == stubIndex)
                                ? stub.buildNewFromSV(swatchIndex, color)
                                : stub;
                    default:
                        return (this.isSVLocked)
                            ? (i == stubIndex)
                                ? stub.buildNewFromHueAndSV(swatchIndex, color)
                                : stub.buildNewFromSV(swatchIndex, color)
                            : (i == stubIndex)
                                ? stub.buildNewFromHueAndSV(swatchIndex, color)
                                : stub;
                }
            });
        }
        return new Palette(newStubs, this.isHorizontal, this.isHueLocked, this.isSVLocked, this.displayAs, color, this.selectedLocation);
    }

    public getSwatch(location: ColorLocation): Swatch {
        return this.stubs[location.stubIndex].swatches[location.swatchIndex];
    }

    public getColor(location: ColorLocation): Color {
        return this.getSwatch(location).color;
    }

    public buildNewPaletteByIsHorizontal(isHorizontal: boolean): Palette {
        if (this.isHorizontal == isHorizontal) return this;
        const newStubs = this.stubs.map((stub) => stub.buildNewFromIsHorizontal(isHorizontal));
        return new Palette(newStubs, isHorizontal, this.isHueLocked, this.isSVLocked, this.displayAs, this.globalColor, this.selectedLocation);
    }

    public buildNewPaletteByIsHueLocked(isHueLocked: boolean): Palette {
        if (this.isHueLocked == isHueLocked) return this;
        const newStubs = this.stubs.map((stub) => stub.buildNewFromIsHueLocked(isHueLocked));
        return new Palette(newStubs, this.isHorizontal, isHueLocked, this.isSVLocked, this.displayAs, this.globalColor, this.selectedLocation);

    }

    public buildNewPaletteByIsSVLocked(isSVLocked: boolean): Palette {
        if (this.isSVLocked == isSVLocked) return this;
        return new Palette(this.stubs, this.isHorizontal, this.isHueLocked, isSVLocked, this.displayAs, this.globalColor, this.selectedLocation);

    }

    public buildNewPaletteByDisplayAs(displayAs: ColorDisplayType): Palette {
        if (this.displayAs == displayAs) return this;
        const newStubs = this.stubs.map((stub) => stub.buildNewFromDisplayAs(displayAs));
        return new Palette(newStubs, this.isHorizontal, this.isHueLocked, this.isSVLocked, displayAs, this.globalColor, this.selectedLocation);

    }

    public emptyClipboard() {
        if (Palette.copiedLocation == null) return;
        this.stubs[Palette.copiedLocation.stubIndex].updateSwatchIsCopied(Palette.copiedLocation.swatchIndex, false);
        Palette.copiedLocation = null;
        Palette.copied = null;
    }

    public saveToClipboard(location: ColorLocation) {
        this.emptyClipboard();
        Palette.copiedLocation = location;
        Palette.copied = this.getColor(Palette.copiedLocation!);
    }

    public toHexCodes(): Array<Array<string>> {
        return this.stubs.map((stub): Array<string> => (
            stub.swatches.map((swatch): string => swatch.color.hex)
        ));
    }

    private constructor(
        stubs: Array<Stub>,
        isHorizontal: boolean,
        isHueLocked: boolean,
        isSVLocked: boolean,
        displayAs: ColorDisplayType,
        globalColor: Color,
        selectedLocation: ColorLocation | null,
    ) {
        this.stubs = stubs;
        this.isHorizontal = isHorizontal;
        this.isHueLocked = isHueLocked;
        this.isSVLocked = isSVLocked;
        this.displayAs = displayAs;
        this.selectedLocation = selectedLocation;
        this.globalColor = globalColor;
    }
}