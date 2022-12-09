import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import IconButton from '@mui/material/IconButton';
import ColorLocation from '../ColorLocation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Color from '../Color';
import { ColorChangeType } from '../Palette';
import SaturationPicker from '../SaturationPicker';
import Settings, { UpdateMethods } from '../Settings';

import styles from './ColorSwatchPicker.module.scss';

interface ColorSwatchPickerProps {
    color: Color,
    settings: Settings,
    methods: UpdateMethods,
    location: ColorLocation,
}

export default function ColorSwatchPicker({ color, settings, methods, location }: ColorSwatchPickerProps) {
    console.log('swatch picker changed');

    const handleColorChange = (newColor: Color) => {
        if (newColor.equals(color)) return;
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    };

    const handlePaste = () => {
        if (settings.copied == null || settings.copied!.equals(color)) return;
        methods.handleSelectedColorChange(ColorChangeType.all)(settings.copied!);
    }

    return (
        <Box className={styles.colorSwatchPicker}>
            <List className={styles.picker} disablePadding>
                <ListItem dense disablePadding>
                    <IconButton size="small" onClick={(event) => {
                        event.stopPropagation();
                        methods.handleColorDeselection();
                    }}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => methods.handleSwatchCopy(location)}>
                        <ContentCopyIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handlePaste}>
                        <ContentPasteIcon />
                    </IconButton>
                </ListItem>
                <ListItem className={styles.stretch} dense disablePadding disableGutters>
                    <SaturationPicker color={color} onChange={handleColorChange} />
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    R: {color.rgb.r}
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    G: {color.rgb.g}
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    B: {color.rgb.b}
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    h: {color.hsv.h.toFixed(0)}
                    <IconButton size="small">
                        <LockIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    s: {color.hsv.s.toFixed(2)}
                    <IconButton size="small">
                        <LockOpenIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    v: {color.hsv.v.toFixed(2)}
                    <IconButton size="small">
                        <LockIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    l: {color.hsl.l.toFixed(2)}
                    <IconButton size="small">
                        <LockOpenIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Box>
    );
}