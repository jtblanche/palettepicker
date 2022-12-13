import Color, { ColorDisplayType } from '../Color';
import Palette, { ColorChangeType } from '../Palette';
import ColorLocation from '../ColorLocation';
import LocalStorageProcessor from '../LocalStorageProcessor';

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
    handleToggleEditSaveName: () => void;
    addStub: () => void;
    removeStub: () => void;
    addShade: () => void;
    removeShade: () => void;
}

export interface SavedSettings {
    isHorizontal: boolean,
    isHueLocked: boolean,
    isSaturationLocked: boolean,
    isValueLocked: boolean,
    isLightnessLocked: boolean,
    displayAs: ColorDisplayType,
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
        bottomRightLocation: ColorLocation,
        flags: SavedSettings,
    ): Settings {
        return new Settings(Color.build('blue'), null, null, null, bottomRightLocation, flags);
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
                displayAs,
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
                displayAs,
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
                displayAs,
            }
        );
    }

    public buildNewFromAddStub(): Settings {
        if (this.bottomRightLocation.stubIndex >= 9) return this;
        const {
            displayAs,
            isHorizontal,
            globalColor,
            selectedLocation,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            bottomRightLocation,
        } = this;
        const nextSelectedLocation = selectedLocation != null ? new ColorLocation(
            selectedLocation!.stubIndex + 1,
            selectedLocation!.swatchIndex) : null;

        return new Settings(
            globalColor,
            nextSelectedLocation,
            null,
            null,
            new ColorLocation(
                bottomRightLocation.stubIndex + 1,
                bottomRightLocation.swatchIndex
            ),
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
                displayAs,
            }
        );
    }

    public buildNewFromRemoveStub(): Settings {
        if (this.bottomRightLocation.stubIndex <= 0) return this;
        const {
            displayAs,
            isHorizontal,
            globalColor,
            selectedLocation,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            bottomRightLocation,
        } = this;
        const nextSelectedLocation = selectedLocation != null ? new ColorLocation(
            selectedLocation!.stubIndex == 0 ? 0 : selectedLocation!.stubIndex - 1,
            selectedLocation!.swatchIndex) : null;

        return new Settings(
            globalColor,
            nextSelectedLocation,
            null,
            null,
            new ColorLocation(
                bottomRightLocation.stubIndex - 1,
                bottomRightLocation.swatchIndex
            ),
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
                displayAs,
            }
        );
    }

    public buildNewFromAddShade(): Settings {
        if (this.bottomRightLocation.swatchIndex >= 9) return this;
        const {
            displayAs,
            isHorizontal,
            globalColor,
            selectedLocation,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            bottomRightLocation,
        } = this;
        const nextSelectedLocation = selectedLocation != null ? new ColorLocation(
            selectedLocation!.stubIndex,
            selectedLocation!.swatchIndex + 1) : null;
        return new Settings(
            globalColor,
            nextSelectedLocation,
            null,
            null,
            new ColorLocation(
                bottomRightLocation.stubIndex,
                bottomRightLocation.swatchIndex + 1
            ),
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
                displayAs,
            }
        );
    }

    public buildNewFromRemoveShade(): Settings {
        if (this.bottomRightLocation.swatchIndex <= 0) return this;
        const {
            displayAs,
            isHorizontal,
            globalColor,
            selectedLocation,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            bottomRightLocation,
        } = this;
        const nextSelectedLocation = selectedLocation != null ? new ColorLocation(
            selectedLocation!.stubIndex,
            selectedLocation!.swatchIndex == 0 ? 0 : selectedLocation!.swatchIndex - 1) : null;

        return new Settings(
            globalColor,
            nextSelectedLocation,
            null,
            null,
            new ColorLocation(
                bottomRightLocation.stubIndex,
                bottomRightLocation.swatchIndex - 1
            ),
            {
                isHorizontal,
                isHueLocked,
                isSaturationLocked,
                isValueLocked,
                isLightnessLocked,
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
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
                displayAs,
            }
        );
    }

    private toSavedSettings(): SavedSettings {
        const {
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            displayAs,
        } = this;
        return {
            isHorizontal,
            isHueLocked,
            isSaturationLocked,
            isValueLocked,
            isLightnessLocked,
            displayAs,
        };
    }

    public toSimpleString() {
        return JSON.stringify(this.toSavedSettings());
    }

    public static buildFromString(input: string, bottomRightLocation: ColorLocation): Settings | null {
        const savedSettings: SavedSettings | null = JSON.parse(input) ?? null;
        return savedSettings == null ? null : Settings.build(bottomRightLocation, savedSettings);
    }

    private constructor(
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
            displayAs,
        }: SavedSettings,
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

export const buildSettingsProcessor = (bottomRightLocation: ColorLocation): LocalStorageProcessor<Settings> => {
    return new LocalStorageProcessor<Settings>({
        uniqueName: 'Settings',
        getDefault: () => Settings.build(bottomRightLocation, {
            isHorizontal: false,
            isHueLocked: false,
            isSaturationLocked: false,
            isValueLocked: false,
            isLightnessLocked: false,
            displayAs: ColorDisplayType.RGB,
        }),
        saveToString: (input: Settings) => input.toSimpleString(),
        deriveFromString: (input: string) => Settings.buildFromString(input, bottomRightLocation)
    })
}