import React from 'react';
import ColorSwatchPicker from '../ColorSwatchPicker';
import Grid from '@mui/material/Grid';
import PaletteColor from '../PaletteColor';

import styles from './ColorSwatch.module.scss';

interface ColorSwatchProps {
    color: PaletteColor,
    isCopied: boolean,
    isSelected: boolean,
    onChange: ((result: PaletteColor) => void),
    onCopy: (() => void),
    onDeselect: (() => void),
    onPaste: (() => void),
    onSelect: (() => void),
}

export default function ColorSwatch({ color, isCopied, isSelected, onChange, onCopy, onDeselect, onPaste, onSelect }: ColorSwatchProps) {
    const copyClass = color.isDark ? styles.copyBorderLight : styles.copyBorder;

    return (
        <Grid className={`${styles.colorSwatch} ${isCopied ? copyClass : ''}`}
            container
            onClick={onSelect}
            sx={{
                backgroundColor: color.backgroundColor,
            }}>
            {isSelected ? <ColorSwatchPicker
                color={color}
                onChange={onChange}
                onCopy={onCopy}
                onDeselect={onDeselect}
                onPaste={onPaste}
            /> : null}
        </Grid>
    );
}