import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import IconButton from '@mui/material/IconButton';
import ColorLocation from '../ColorLocation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Color from '../Color';
import { ColorChangeType } from '../Palette';
import SaturationPicker from '../SaturationPicker';
import Settings, { UpdateMethods } from '../Settings';

import styles from './ColorSwatchPicker.module.scss';

interface CircleIconProps {
    displayHorizontally: boolean,
    isSelected: boolean,
}

function CircleIcon({ displayHorizontally, isSelected }: CircleIconProps) {
    return (
        <React.Fragment>
            {displayHorizontally && isSelected && (
                <SwapHorizontalCircleIcon></SwapHorizontalCircleIcon>
            )}
            {displayHorizontally && !isSelected && (
                <SwapHorizontalCircleOutlinedIcon></SwapHorizontalCircleOutlinedIcon>
            )}
            {!displayHorizontally && isSelected && (
                <SwapVerticalCircleIcon></SwapVerticalCircleIcon>
            )}
            {!displayHorizontally && !isSelected && (
                <SwapVerticalCircleOutlinedIcon></SwapVerticalCircleOutlinedIcon>
            )}
        </React.Fragment>
    );
}

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

    const incrementR = () => {
        const rgb = color.rgb;
        rgb.r += 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementR = () => {
        const rgb = color.rgb;
        rgb.r -= 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementG = () => {
        const rgb = color.rgb;
        rgb.g += 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementG = () => {
        const rgb = color.rgb;
        rgb.g -= 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementB = () => {
        const rgb = color.rgb;
        rgb.b += 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementB = () => {
        const rgb = color.rgb;
        rgb.b -= 1;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementH = () => {
        const hsv = color.hsv;
        hsv.h = (hsv.h + 1) % 360;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementH = () => {
        const hsv = color.hsv;
        hsv.h = (360 + hsv.h - 1) % 360;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementS = () => {
        const hsv = color.hsv;
        hsv.s += 0.01;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementS = () => {
        const hsv = color.hsv;
        hsv.s -= 0.01;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementV = () => {
        const hsv = color.hsv;
        hsv.v += 0.01;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementV = () => {
        const hsv = color.hsv;
        hsv.v -= 0.01;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const incrementL = () => {
        const hsl = color.hsl;
        hsl.l += 0.01;
        const newColor = Color.build(hsl);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const decrementL = () => {
        const hsl = color.hsl;
        hsl.l -= 0.01;
        const newColor = Color.build(hsl);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
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
                    <IconButton size="small" onClick={decrementR}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    r: {color.rgb.r}
                    <IconButton size="small" onClick={incrementR}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small" onClick={decrementG}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    g: {color.rgb.g}
                    <IconButton size="small" onClick={incrementG}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small" onClick={decrementB}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    b: {color.rgb.b}
                    <IconButton size="small" onClick={incrementB}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small" onClick={decrementH}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    h: {color.hsv.h.toFixed(0)}
                    <IconButton size="small" onClick={methods.handleToggleHueLock}>
                        <CircleIcon
                            displayHorizontally={settings.isHorizontal}
                            isSelected={settings.isHueLocked}
                        />
                    </IconButton>
                    <IconButton size="small" onClick={incrementH}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small" onClick={decrementS}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    s: {color.hsv.s.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleSaturationLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isSaturationLocked}
                        />
                    </IconButton>
                    <IconButton size="small" onClick={incrementS}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small" onClick={decrementV}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    v: {color.hsv.v.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleValueLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isValueLocked}
                        />
                    </IconButton>
                    <IconButton size="small" onClick={incrementV}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small" onClick={decrementL}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    l: {color.hsl.l.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleLightnessLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isLightnessLocked}
                        />
                    </IconButton>
                    <IconButton size="small" onClick={incrementL}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Box>
    );
}