import React from 'react';
import ColorSwatch from '../ColorSwatch';
import Box from '@mui/material/Box';
import Color from '../Color';
import Stub from '../Stub';

import styles from './ColorStub.module.scss';
import Palette from '../Palette';
import Settings from '../Settings';
import ColorLocation from '../ColorLocation';


interface ColorStubProps {
    className?: string | null,
    stub: Stub,
    settings: Settings,
    stubIndex: number,
    onUpdateSelectedColor: (result: Color) => void,
    onUpdateSelectedColorSV: (result: Color) => void,
    onSwatchCopy: ((index: number) => void)
    onSwatchDeselect: (() => void),
    onSwatchSelect: ((index: number) => void),
}

export default function ColorStub({
    className = null,
    stub,
    settings,
    stubIndex,
    onUpdateSelectedColor,
    onUpdateSelectedColorSV,
    onSwatchCopy,
    onSwatchDeselect,
    onSwatchSelect
}: ColorStubProps) {
    const location = (swatchIndex: number): ColorLocation => new ColorLocation(stubIndex, swatchIndex);
    const isSelected = settings.selectedLocation?.stubIndex == stubIndex;

    const handleSwatchCopy = (index: number) => () => {
        onSwatchCopy(index);
    }

    const handleSwatchSelect = (index: number) => () => {
        onSwatchSelect(index);
    }
    const swatchesFr = stub.swatches.map((_, swatchIndex): string =>
        (settings.selectedLocation?.swatchIndex == swatchIndex) ? '4fr' : '1fr'
    ).join(' ');
    const gridTemplateColumns = settings.isHorizontal ? swatchesFr : '1fr';
    const gridTemplateRows = settings.isHorizontal ? '1fr' : swatchesFr;
    const gridRowsOrColumns: string | null = isSelected ? `span ${stub.swatches.length}` : null;

    return (
        <Box
            sx={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows,
            }}
            className={`${className ?? ''} ${styles.colorStub}`.trim()}>
            {stub.swatches.map((swatch, index) => (
                <ColorSwatch
                    key={index}
                    swatch={swatch}
                    settings={settings}
                    location={location(index)}
                    onChange={onUpdateSelectedColorSV}
                    onPaste={onUpdateSelectedColor}
                    onCopy={handleSwatchCopy(index)}
                    onDeselect={onSwatchDeselect}
                    onSelect={handleSwatchSelect(index)}
                />
            ))}
        </Box>
    );
}