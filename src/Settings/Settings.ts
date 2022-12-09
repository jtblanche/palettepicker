import Color, { ColorDisplayType } from '../Color';
import Palette, { ColorChangeType } from '../Palette';
import ColorLocation from '../ColorLocation';

export interface UpdateMethods {
    handleToggleDirection: () => void;
    handleToggleHueLock: () => void;
    handleSwatchCopy: (location: ColorLocation) => void;
    handlePaste: () => void;
    handleToggleSaturationLock: () => void;
    handleToggleValueLock: () => void;
    handleToggleLightnessLock: () => void;
    handleToggleIsBrightnessMode: () => void;
    handleColorSelection: (location: ColorLocation) => void;
    handleColorDeselection: () => void;
    handleSelectedColorChange: (changeType: ColorChangeType) => (color: Color) => void;
    handleToggleEditStubNumber: () => void;
    changeStubNumber: (stubNumber: number) => void;
    addStub: () => void;
    removeStub: () => void;
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
    readonly bottomRightLocation: ColorLocation;

    public static build(
        displayAs: ColorDisplayType,
        bottomRightLocation: ColorLocation,
        flags: SettingsFlags,
    ): Settings {
        return new Settings(displayAs, Color.build('blue'), null, null, null, bottomRightLocation, flags);
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
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            null,
            copiedLocation,
            copied,
            bottomRightLocation,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromSelection(location: ColorLocation, palette: Palette): Settings {
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
            bottomRightLocation,
        } = this;
        if (location.equals(selectedLocation)) return this;
        return new Settings(
            displayAs,
            palette.getColor(location),
            location,
            copiedLocation,
            copied,
            bottomRightLocation,
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
            }
        );
    }

    public buildNewFromGlobalColor(color: Color, changeType: ColorChangeType): Settings {
        let updatedColor = color;
        switch (changeType) {
            case ColorChangeType.hue:
                updatedColor = this.globalColor.buildNewFromHue(color);
                break;
            case ColorChangeType.svl:
                updatedColor = this.globalColor.buildNewFromSVL(color, {
                    isSaturationChange: true,
                    isValueChange: true,
                    isLightnessChange: false
                });
                break;
            default:
                break;
        }
        if (this.globalColor.equals(updatedColor)) return this;
        const {
            displayAs,
            selectedLocation,
            isHueLocked,
            isHorizontal,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            copiedLocation,
            copied,
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            updatedColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
        if (this.isHorizontal === isHorizontal) return this;
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
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
        if (this.isHueLocked === isHueLocked) return this;
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
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
        if (this.isSaturationLocked === isSaturationLocked) return this;
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
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
            bottomRightLocation,
        } = this;
        if (this.isValueLocked === isValueLocked && (isLightnessLocked === (isLightnessLocked && !isValueLocked))) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
            bottomRightLocation,
        } = this;
        if (this.isLightnessLocked === isLightnessLocked && (isValueLocked === (isValueLocked && !isLightnessLocked))) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
        if (this.displayAs === displayAs) return this;
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
            bottomRightLocation,
        } = this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            copiedLocation,
            copied,
            bottomRightLocation,
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
            bottomRightLocation,
        } = this;
        if (copiedLocation == null) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            null,
            copied,
            bottomRightLocation,
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
            bottomRightLocation,
        } = this;
        if (copiedLocation === location) return this;
        return new Settings(
            displayAs,
            globalColor,
            selectedLocation,
            location,
            palette.getColor(location),
            bottomRightLocation,
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
        bottomRightLocation: ColorLocation,
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
        this.bottomRightLocation = bottomRightLocation;
    }
}