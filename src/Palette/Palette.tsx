import { stepButtonClasses } from '@mui/material';
import { palette } from '@mui/system';
import Color, { ColorDisplayType } from '../Color';
import Settings from '../Settings';
import Stub from '../Stub';
import Swatch from '../Swatch';

export interface ColorLocation {
    stubIndex: number;
    swatchIndex: number;
}

export enum ColorChangeType {
    hue,
    svl,
    all
}

export default class Palette {
    readonly stubs: Array<Stub>;

    public static build(
        hexStubs: Array<Array<string>>,
        settings: Settings,
    ): Palette {
        const stubs = hexStubs.map(
            (stubStrings: Array<string>): Stub => {
                const swatches = stubStrings.map(
                    (hex: string): Swatch => {
                        const color = Color.build(settings.displayAs, hex);
                        return Swatch.build(color, settings.isHorizontal)
                    }
                );
                return Stub.build(swatches, settings.displayAs, { isHorizontal: settings.isHorizontal, isHueLocked: settings.isHueLocked });
            }
        );
        return new Palette(stubs);
    }

    public buildNewFromDeselection(): Palette {
        let newStubs = [...this.stubs];
        newStubs = newStubs.map((stub): Stub => {
            if (stub.selectedIndex == null) return stub;
            return stub.buildNewFromDeselectAll();
        });
        return new Palette(newStubs);
    }

    public buildNewFromSelection(settings: Settings): Palette {
        if (settings.selectedLocation == null) return this;
        const {
            stubIndex,
            swatchIndex
        } = settings.selectedLocation!;
        let newStubs = [...this.stubs]
        newStubs = newStubs.map((stub, i): Stub => {
            const stubIsSelected = stubIndex == i;
            if ((stub.isSelected == stubIsSelected) && swatchIndex == stub.selectedIndex) return stub;
            return stubIsSelected
                ? stub.buildNewFromSelectedIndex(swatchIndex)
                : stub.buildNewFromShadeIndex(swatchIndex)
        });
        return new Palette(newStubs);
    }

    public buildNewFromColor(color: Color, changeType: ColorChangeType, settings: Settings): Palette {
        if (settings.selectedLocation == null || this.getColor(settings.selectedLocation).equals(color)) return this;
        let newStubs = [...this.stubs];
        if (settings.selectedLocation != null) {
            const { stubIndex, swatchIndex } = settings.selectedLocation!;
            newStubs = newStubs.map((stub, i) => {
                switch (changeType) {
                    case ColorChangeType.hue:
                        return (i == stubIndex)
                            ? stub.buildNewFromHue(swatchIndex, color)
                            : stub;
                    case ColorChangeType.svl:
                        return (settings.isSaturationLocked || settings.isValueLocked || settings.isLightnessLocked)
                            ? (i == stubIndex)
                                ? stub.buildNewFromSVL(swatchIndex, color, {
                                    isSaturationChange: true,
                                    isValueChange: true,
                                    isLightnessChange: false
                                })
                                : stub.buildNewFromSVL(swatchIndex, color, {
                                    isSaturationChange: settings.isSaturationLocked,
                                    isValueChange: settings.isValueLocked,
                                    isLightnessChange: settings.isLightnessLocked
                                })
                            : (i == stubIndex)
                                ? stub.buildNewFromSVL(swatchIndex, color, {
                                    isSaturationChange: true,
                                    isValueChange: true,
                                    isLightnessChange: false
                                })
                                : stub;
                    default:
                        return (settings.isSaturationLocked || settings.isValueLocked || settings.isLightnessLocked)
                            ? (i == stubIndex)
                                ? stub.buildNewFromHueAndSV(swatchIndex, color)
                                : stub.buildNewFromSVL(swatchIndex, color, {
                                    isSaturationChange: settings.isSaturationLocked,
                                    isValueChange: settings.isValueLocked,
                                    isLightnessChange: settings.isLightnessLocked
                                })
                            : (i == stubIndex)
                                ? stub.buildNewFromHueAndSV(swatchIndex, color)
                                : stub;
                }
            });
        }
        return new Palette(newStubs);
    }

    public getSwatch(location: ColorLocation): Swatch {
        return this.stubs[location.stubIndex].swatches[location.swatchIndex];
    }

    public getColor(location: ColorLocation): Color {
        return this.getSwatch(location).color;
    }

    public buildNewPaletteByIsHorizontal(settings: Settings): Palette {
        let newStubs = [...this.stubs];
        newStubs = newStubs.map((stub) => stub.buildNewFromIsHorizontal(settings.isHorizontal));
        return new Palette(newStubs);
    }

    public buildNewPaletteByIsHueLocked(settings: Settings): Palette {
        let newStubs = [...this.stubs];
        newStubs = newStubs.map((stub) => stub.buildNewFromIsHueLocked(settings.isHueLocked));
        return new Palette(newStubs);

    }

    public buildNewFromAddNewStub(settings: Settings): Palette {
        let newStubs = [...this.stubs];
        const selectedOrEnd: number = settings.selectedLocation?.stubIndex ?? (newStubs.length - 1);
        if (selectedOrEnd != -1) {
            newStubs = [
                ...newStubs.filter((_, index) => index <= selectedOrEnd).map((stub) => stub),
                newStubs[selectedOrEnd].copy(),
                ...newStubs.splice(selectedOrEnd + 1).map((stub) => stub)
            ]
        } else {
            const defaultColors = [
                "#951F27",
                "#EF5C5A",
                "#FFA7A5",
                "#FFEEEE"
            ];
            const swatches = defaultColors.map(
                (hex: string): Swatch => {
                    const color = Color.build(settings.displayAs, hex);
                    return Swatch.build(color, settings.isHorizontal)
                }
            );
            newStubs = [
                Stub.build(swatches, settings.displayAs, { isHorizontal: settings.isHorizontal, isHueLocked: settings.isHueLocked }),
            ];
        }
        return new Palette(newStubs);

    }

    public buildNewFromRemoveStub(settings: Settings): Palette {
        const prevLocation = settings.selectedLocation;
        const newPalette = this.buildNewFromDeselection();
        let newStubs = [...newPalette.stubs];
        const selectedOrEnd: number = prevLocation?.stubIndex ?? (newStubs.length - 1);
        if (selectedOrEnd != -1) {
            newStubs = [
                ...newStubs.filter((_, index) => index < selectedOrEnd).map((stub) => stub),
                ...newStubs.splice(selectedOrEnd + 1).map((stub) => stub)
            ]
        }
        return new Palette(newStubs);

    }

    public buildNewFromEmptyClipboard(settings: Settings): Palette {
        if (settings.copiedLocation == null) return this;
        const { stubIndex, swatchIndex } = settings.copiedLocation!;
        const newStubs = [...this.stubs];
        newStubs[stubIndex] = newStubs[stubIndex].buildNewFromIsCopied(swatchIndex, false);
        return new Palette(newStubs);
    }

    public buildNewFromSaveToClipboard(location: ColorLocation, settings: Settings): Palette {
        if (settings.copiedLocation == location) return this;
        const { stubIndex, swatchIndex } = location;
        const newStubs = [...this.stubs];
        newStubs[stubIndex] = newStubs[stubIndex].buildNewFromIsCopied(swatchIndex, true);
        return new Palette(newStubs);
    }

    public toHexCodes(): Array<Array<string>> {
        return [...this.stubs].map((stub): Array<string> => (
            [...stub.swatches].map((swatch): string => swatch.color.hex)
        ));
    }

    private constructor(
        stubs: Array<Stub>,
    ) {
        this.stubs = [...stubs];
    }
}