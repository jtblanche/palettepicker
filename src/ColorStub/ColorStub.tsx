import React from 'react';
import ColorSwatch from '../ColorSwatch';
import Box from '@mui/material/Box';
import Color from '../Color';
import Stub from '../Stub';

import styles from './ColorStub.module.scss';
import Palette from '../Palette';


interface ColorStubProps {
    className?: string | null,
    stub: Stub,
    onUpdateSelectedColor: (result: Color) => void,
    onUpdateSelectedColorSV: (result: Color) => void,
    onSwatchCopy: ((index: number) => void)
    onSwatchDeselect: (() => void),
    onSwatchSelect: ((index: number) => void),
}

export default function ColorStub({
    className = null,
    stub,
    onUpdateSelectedColor,
    onUpdateSelectedColorSV,
    onSwatchCopy,
    onSwatchDeselect,
    onSwatchSelect
}: ColorStubProps) {
    const thisIsNull = (stub.swatches[Palette.copiedLocation?.swatchIndex ?? -1]?.isCopied ?? false) ? console.log('stub copied') : null;

    const handleSwatchCopy = (index: number) => () => {
        onSwatchCopy(index);
    }

    const handleSwatchSelect = (index: number) => () => {
        onSwatchSelect(index);
    }
    const screenPercentage = stub.isHorizontal ? '20px' : '20px';
    const selectedSpacing = stub.isSelected ? `${screenPercentage} 1fr ${screenPercentage}` : '1fr';
    const gridTemplateColumns = stub.isHorizontal ? stub.swatches.map((swatch): string => (swatch.isSelected || swatch.isShadeSelected) ? '4fr' : '1fr').join(' ') : selectedSpacing;
    const gridTemplateRows = stub.isHorizontal ? selectedSpacing : stub.swatches.map((swatch): string => (swatch.isSelected || swatch.isShadeSelected) ? '4fr' : '1fr').join(' ');
    const gridRowsOrColumns: string | null = stub.isSelected ? `span ${stub.swatches.length}` : null;

    return (
        <Box
            sx={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows,
            }}
            className={`${className ?? ''} ${styles.colorStub}`.trim()}>
            {stub.isSelected && (
                <Box sx={{
                    backgroundColor: 'grey',
                    gridColumn: stub.isHorizontal ? gridRowsOrColumns : null,
                    gridRow: stub.isHorizontal ? null : gridRowsOrColumns,
                }}>

                </Box>
            )}
            {stub.swatches.map((swatch, index) => (
                <React.Fragment key={index}>
                    <ColorSwatch
                        swatch={swatch}
                        onChange={onUpdateSelectedColorSV}
                        onPaste={onUpdateSelectedColor}
                        onCopy={handleSwatchCopy(index)}
                        onDeselect={onSwatchDeselect}
                        onSelect={handleSwatchSelect(index)}
                    />
                    {stub.isSelected && !stub.isHorizontal && index == 0 && (
                        <Box sx={{
                            backgroundColor: 'grey',
                            gridColumn: stub.isHorizontal ? gridRowsOrColumns : null,
                            gridRow: stub.isHorizontal ? null : gridRowsOrColumns,
                        }}>

                        </Box>
                    )}
                </React.Fragment>
            ))}
            {stub.isSelected && stub.isHorizontal && (
                <Box sx={{
                    backgroundColor: 'grey',
                    gridColumn: stub.isHorizontal ? gridRowsOrColumns : null,
                    gridRow: stub.isHorizontal ? null : gridRowsOrColumns,
                }}>

                </Box>
            )}
        </Box>
    );
}