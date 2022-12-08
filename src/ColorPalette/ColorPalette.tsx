import React from 'react';
import ColorStub from '../ColorStub';
import Box from '@mui/material/Box';
import Color from '../Color';
import Palette, { ColorLocation } from '../Palette';

import styles from './ColorPalette.module.scss';


interface ColorPaletteProps {
    className?: string | null,
    palette: Palette,
    onSwatchDeselect: () => void,
    onSwatchSelect: (location: ColorLocation) => void,
    onUpdateSelectedColorSV: (color: Color) => void,
    onUpdateSelectedColor: (color: Color) => void
}

export default function ColorPalette({
    className = null,
    palette,
    onSwatchDeselect,
    onSwatchSelect,
    onUpdateSelectedColorSV,
    onUpdateSelectedColor,
}: ColorPaletteProps) {
    const handleSwatchCopy = (stubIndex: number) => (swatchIndex: number) => {
        palette.saveToClipboard({ stubIndex, swatchIndex });
    }

    const handleSwatchDeselect = () => {
        onSwatchDeselect();
    }

    const handleSwatchSelect = (stubIndex: number) => (swatchIndex: number) => {
        onSwatchSelect({ stubIndex, swatchIndex });
    }
    const gridTemplateColumns = palette.isHorizontal ? '1fr' : palette.stubs.map((stub): string => stub.isSelected ? '4fr' : '1fr').join(' ');
    const gridTemplateRows = palette.isHorizontal ? palette.stubs.map((stub): string => stub.isSelected ? '4fr' : '1fr').join(' ') : '1fr';

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
                    onUpdateSelectedColorSV={onUpdateSelectedColorSV}
                    onUpdateSelectedColor={onUpdateSelectedColor}
                    onSwatchCopy={handleSwatchCopy(index)}
                    onSwatchDeselect={handleSwatchDeselect}
                    onSwatchSelect={handleSwatchSelect(index)}
                />
            ))}
        </Box>
    );
}