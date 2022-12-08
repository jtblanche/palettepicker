import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Color from '../Color';
import Palette from '../Palette';
import SaturationPicker from '../SaturationPicker';

import styles from './ColorSwatchPicker.module.scss';

interface ColorSwatchPickerProps {
    color: Color,
    onPaste: ((result: Color) => void),
    onChange: ((result: Color) => void),
    onCopy: (() => void),
    onDeselect: (() => void),
}

export default function ColorSwatchPicker({ color, onChange, onCopy, onPaste, onDeselect }: ColorSwatchPickerProps) {
    console.log('swatch picker changed');

    const handleColorChange = (newColor: Color) => {
        if (newColor.equals(color)) return;
        onChange(newColor);
    };

    const handlePaste = () => {
        if (Palette.copied == null || Palette.copied!.equals(color)) return;
        onPaste(Palette.copied!);
    }

    return (
        <Box className={styles.colorSwatchPicker}>
            <List className={styles.picker} disablePadding>
                <ListItem dense disablePadding>
                    <IconButton size="small" onClick={(event) => {
                        event.stopPropagation();
                        onDeselect();
                    }}>
                        <CloseIcon />
                    </IconButton>
                </ListItem>
                <ListItem className={styles.stretch} dense disablePadding disableGutters>
                    <SaturationPicker color={color} onChange={handleColorChange} />
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small" onClick={onCopy}>
                        <ContentCopyIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handlePaste}>
                        <ContentPasteIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Box>
    );
}