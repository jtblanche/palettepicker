import React from 'react';
import ColorSwatchPicker from '../ColorSwatchPicker';
import Box from '@mui/material/Box';
import Color from '../Color';
import Swatch from '../Swatch';

import styles from './ColorSwatch.module.scss';

interface ColorSwatchProps {
    className?: string | null,
    swatch: Swatch,
    onChange: ((result: Color) => void),
    onPaste: ((result: Color) => void),
    onCopy: (() => void),
    onDeselect: (() => void),
    onSelect: (() => void),
}

export default function ColorSwatch({
    className = null,
    swatch,
    onChange,
    onPaste,
    onCopy,
    onDeselect,
    onSelect
}: ColorSwatchProps) {
    const copyClass = swatch.color.isDark ? styles.copyBorderLight : styles.copyBorder;

    return (
        <Box className={`${className ?? ''} ${styles.colorSwatch} ${swatch.isCopied ? copyClass : ''}`.trim()}
            onClick={onSelect}
            sx={{
                backgroundColor: swatch.color.backgroundColor,
            }}>
            {swatch.isSelected ? <ColorSwatchPicker
                color={swatch.color}
                onChange={onChange}
                onCopy={onCopy}
                onPaste={onPaste}
                onDeselect={onDeselect}
            /> : null}
        </Box>
    );
}