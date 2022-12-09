import React from 'react';
import ColorStub from '../ColorStub';
import Box from '@mui/material/Box';
import Color from '../Color';
import Palette from '../Palette';
import Settings from '../Settings';
import ColorLocation from '../ColorLocation';

import styles from './ColorPalette.module.scss';


interface ColorPaletteProps {
    className?: string | null,
    palette: Palette,
    settings: Settings,
    onSwatchCopy: ((location: ColorLocation) => void),
    onSwatchDeselect: () => void,
    onSwatchSelect: (location: ColorLocation) => void,
    onUpdateSelectedColorSV: (color: Color) => void,
    onUpdateSelectedColor: (color: Color) => void
}

export default function ColorPalette({
    className = null,
    palette,
    settings,
    onSwatchDeselect,
    onSwatchSelect,
    onUpdateSelectedColorSV,
    onUpdateSelectedColor,
    onSwatchCopy,
}: ColorPaletteProps) {
    const handleSwatchCopy = (stubIndex: number) => (swatchIndex: number) => {
        onSwatchCopy(new ColorLocation(stubIndex, swatchIndex));
    }

    const handleSwatchSelect = (stubIndex: number) => (swatchIndex: number) => {
        onSwatchSelect(new ColorLocation(stubIndex, swatchIndex));
    }
    const stubFr = palette.stubs.map((_, stubIndex): string => settings.selectedLocation?.stubIndex == stubIndex ? '4fr' : '1fr').join(' ')
    const gridTemplateColumns = settings.isHorizontal ? '1fr' : stubFr;
    const gridTemplateRows = settings.isHorizontal ? stubFr : '1fr';

    return (
        <Box
            sx={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows,
            }}
            className={`${className ?? ''} ${styles.colorPalette}`.trim()}>
            {palette.stubs.map((stub, index) => (
                <ColorStub
                    key={index}
                    stub={stub}
                    stubIndex={index}
                    settings={settings}
                    onUpdateSelectedColorSV={onUpdateSelectedColorSV}
                    onUpdateSelectedColor={onUpdateSelectedColor}
                    onSwatchCopy={handleSwatchCopy(index)}
                    onSwatchDeselect={onSwatchDeselect}
                    onSwatchSelect={handleSwatchSelect(index)}
                />
            ))}
        </Box>
    );
}