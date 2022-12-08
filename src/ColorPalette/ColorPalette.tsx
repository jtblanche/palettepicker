import React from 'react';
import ColorStub from '../ColorStub';
import Box from '@mui/material/Box';
import Color from '../Color';
import Palette, { ColorLocation } from '../Palette';

import styles from './ColorPalette.module.scss';


interface ColorPaletteProps {
    className?: string | null,
    palette: Palette,
    onSwatchCopy: ((location: ColorLocation) => void),
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
    onSwatchCopy,
}: ColorPaletteProps) {
    const thisIsNull = (palette.stubs[Palette.copiedLocation?.stubIndex ?? -1]?.swatches[Palette.copiedLocation?.swatchIndex ?? -1]?.isCopied ?? false) ? console.log('palette copied') : null;
    const handleSwatchCopy = (stubIndex: number) => (swatchIndex: number) => {
        onSwatchCopy({ stubIndex, swatchIndex });
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
                    onSwatchDeselect={onSwatchDeselect}
                    onSwatchSelect={handleSwatchSelect(index)}
                />
            ))}
        </Box>
    );
}