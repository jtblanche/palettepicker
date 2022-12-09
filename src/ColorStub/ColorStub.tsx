import React from 'react';
import ColorSwatch from '../ColorSwatch';
import Box from '@mui/material/Box';
import Color from '../Color';
import Stub from '../Stub';

import styles from './ColorStub.module.scss';
import Palette from '../Palette';
import Settings from '../Settings';


interface ColorStubProps {
    className?: string | null,
    stub: Stub,
    settings: Settings,
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
    onUpdateSelectedColor,
    onUpdateSelectedColorSV,
    onSwatchCopy,
    onSwatchDeselect,
    onSwatchSelect
}: ColorStubProps) {
    const thisIsNull = (stub.swatches[settings.copiedLocation?.swatchIndex ?? -1]?.isCopied ?? false) ? console.log('stub copied') : null;

    const handleSwatchCopy = (index: number) => () => {
        onSwatchCopy(index);
    }

    const handleSwatchSelect = (index: number) => () => {
        onSwatchSelect(index);
    }
    const gridTemplateColumns = stub.isHorizontal ? stub.swatches.map((swatch): string => (swatch.isSelected || swatch.isShadeSelected) ? '4fr' : '1fr').join(' ') : '1fr';
    const gridTemplateRows = stub.isHorizontal ? '1fr' : stub.swatches.map((swatch): string => (swatch.isSelected || swatch.isShadeSelected) ? '4fr' : '1fr').join(' ');
    const gridRowsOrColumns: string | null = stub.isSelected ? `span ${stub.swatches.length}` : null;

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