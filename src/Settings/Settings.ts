import Color, { ColorDisplayType } from '../Color';
import Palette from '../Palette';

export interface ColorLocation {
    stubIndex: number;
    swatchIndex: number;
}

export enum ColorChangeType {
    hue,
    svl,
    all
}

export interface SettingsFlags {
    isHorizontal: boolean,
    isHueLocked: boolean,
    isSaturationLocked: boolean,
    isValueLocked: boolean,
    isLightnessLocked: boolean
}

export default class Settings {
    readonly isHorizontal: boolean;
    readonly isHueLocked: boolean;
    readonly isSaturationLocked: boolean;
    readonly isValueLocked: boolean;
    readonly isLightnessLocked: boolean;
    readonly displayAs: ColorDisplayType;
    readonly selectedLocation: ColorLocation | null;
    readonly globalColor: Color;
    readonly copiedLocation: ColorLocation | null;
    readonly copied: Color | null;

    public static build(
        displayAs: ColorDisplayType,
        flags: SettingsFlags,
    ): Settings {
        return new Settings(displayAs, Color.build(displayAs, 'blue'), null, null, null, flags);
    }

    public buildNewFromDeselection() {
        if (this.selectedLocation == null) return this;
        const {
            displayAs,
            globalColor,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            null,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromSelection({ stubIndex, swatchIndex }: ColorLocation, palette: Palette): Settings {
        const {
            displayAs,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        if (selectedLocation?.stubIndex == stubIndex && selectedLocation?.swatchIndex == swatchIndex) return this;
        return new Settings(
            displayAs,
            palette.getColor({
                stubIndex,
                swatchIndex
            }),
            {
                stubIndex,
                swatchIndex
            },
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromIsHorizontal(isHorizontal: boolean): Settings {
        if (this.isHorizontal == isHorizontal) return this;
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromIsHueLocked(isHueLocked: boolean): Settings {
        if (this.isHueLocked == isHueLocked) return this;
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );

    }

    public buildNewFromIsSaturationLocked(isSaturationLocked: boolean): Settings {
        if (this.isSaturationLocked == isSaturationLocked) return this;
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );

    }

    public buildNewFromIsValueLocked(isValueLocked: boolean): Settings {
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        if (this.isValueLocked == isValueLocked && (isLightnessLocked == (isLightnessLocked && !isValueLocked))) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked: isLightnessLocked && !isValueLocked,
            }
        );
    }

    public buildNewFromIsLightnessLocked(isLightnessLocked: boolean): Settings {
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            copiedLocation,
            copied,
        } = this;
        if (this.isLightnessLocked == isLightnessLocked && (isValueLocked == (isValueLocked && !isLightnessLocked))) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked: isValueLocked && !isLightnessLocked,
                isLightnessLocked,
            }
        );

    }

    public buildNewFromDisplayAs(displayAs: ColorDisplayType): Settings {
        if (this.displayAs == displayAs) return this;
        const {
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromEmptyClipboard(): Settings {
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
        } = this;
        if (copiedLocation == null) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            null,
            copied,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromSaveToClipboard(location: ColorLocation, palette: Palette): Settings {
        const {
            displayAs,
            globalColor,
            selectedLocation,
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
        } = this;
        if (copiedLocation == location) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            location,
            palette.getColor(location),
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    private constructor(
        displayAs: ColorDisplayType,
        globalColor: Color,
        selectedLocation: ColorLocation | null,
        copiedLocation: ColorLocation | null,
        copied: Color | null,
        {
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
        }: SettingsFlags,
    ) {
        this.isHorizontal = isHorizontal;
        this.isHueLocked = isHueLocked;
        this.isSaturationLocked = isSaturationLocked;
        this.isValueLocked = isValueLocked;
        this.isLightnessLocked = isLightnessLocked;
        this.displayAs = displayAs;
        this.selectedLocation = selectedLocation;
        this.globalColor = globalColor;
        this.copiedLocation = copiedLocation;
        this.copied = copied;
    }
}