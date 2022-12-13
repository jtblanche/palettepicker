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

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback: React.MutableRefObject<(() => void) | null> = React.useRef(null);

    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
        function tick() {
            if (savedCallback.current != null) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            tick();
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function ColorSwatchPicker({ color, settings, methods, location }: ColorSwatchPickerProps) {
    console.log('swatch picker changed');

    const handleColorChange = (newColor: Color) => {
        if (newColor.equals(color)) return;
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    };

    const incrementR = () => {
        const rgb = color.rgb;
        rgb.r += 1;
        if (rgb.r > 255) rgb.r = 255;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isIncrementingR, setIsIncrementingR] = React.useState(false);

    useInterval(incrementR, isIncrementingR ? 100 : null);

    const decrementR = () => {
        const rgb = color.rgb;
        rgb.r -= 1;
        if (rgb.r < 0) rgb.r = 0;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isDecrementingR, setIsDecrementingR] = React.useState(false);

    useInterval(decrementR, isDecrementingR ? 100 : null);

    const incrementG = () => {
        const rgb = color.rgb;
        rgb.g += 1;
        if (rgb.g > 255) rgb.g = 255;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isIncrementingG, setIsIncrementingG] = React.useState(false);

    useInterval(incrementG, isIncrementingG ? 100 : null);

    const decrementG = () => {
        const rgb = color.rgb;
        rgb.g -= 1;
        if (rgb.g < 0) rgb.g = 0;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isDecrementingG, setIsDecrementingG] = React.useState(false);

    useInterval(decrementG, isDecrementingG ? 100 : null);

    const incrementB = () => {
        const rgb = color.rgb;
        rgb.b += 1;
        if (rgb.b > 255) rgb.b = 255;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isIncrementingB, setIsIncrementingB] = React.useState(false);

    useInterval(incrementB, isIncrementingB ? 100 : null);

    const decrementB = () => {
        const rgb = color.rgb;
        rgb.b -= 1;
        if (rgb.b < 0) rgb.b = 0;
        const newColor = Color.build(rgb);
        methods.handleSelectedColorChange(ColorChangeType.all)(newColor);
    }

    const [isDecrementingB, setIsDecrementingB] = React.useState(false);

    useInterval(decrementB, isDecrementingB ? 100 : null);

    const incrementH = () => {
        const hsv = color.hsv;
        hsv.h = (hsv.h + 1) % 360;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.hue)(newColor);
    }

    const [isIncrementingH, setIsIncrementingH] = React.useState(false);

    useInterval(incrementH, isIncrementingH ? 100 : null);

    const decrementH = () => {
        const hsv = color.hsv;
        hsv.h = (360 + hsv.h - 1) % 360;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.hue)(newColor);
    }

    const [isDecrementingH, setIsDecrementingH] = React.useState(false);

    useInterval(decrementH, isDecrementingH ? 100 : null);

    const incrementS = () => {
        const hsv = color.hsv;
        hsv.s += 0.01;
        if (hsv.s > 1) hsv.s = 1;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isIncrementingS, setIsIncrementingS] = React.useState(false);

    useInterval(incrementS, isIncrementingS ? 100 : null);

    const decrementS = () => {
        const hsv = color.hsv;
        hsv.s -= 0.01;
        if (hsv.s < 0) hsv.s = 0;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isDecrementingS, setIsDecrementingS] = React.useState(false);

    useInterval(decrementS, isDecrementingS ? 100 : null);

    const incrementV = () => {
        const hsv = color.hsv;
        hsv.v += 0.01;
        if (hsv.v > 1) hsv.v = 1;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isIncrementingV, setIsIncrementingV] = React.useState(false);

    useInterval(incrementV, isIncrementingV ? 100 : null);

    const decrementV = () => {
        const hsv = color.hsv;
        hsv.v -= 0.01;
        if (hsv.v < 0) hsv.v = 0;
        const newColor = Color.build(hsv);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isDecrementingV, setIsDecrementingV] = React.useState(false);

    useInterval(decrementV, isDecrementingV ? 100 : null);

    const incrementL = () => {
        const hsl = color.hsl;
        hsl.l += 0.01;
        if (hsl.l > 1) hsl.l = 1;
        const newColor = Color.build(hsl);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isIncrementingL, setIsIncrementingL] = React.useState(false);

    useInterval(incrementL, isIncrementingL ? 100 : null);

    const decrementL = () => {
        const hsl = color.hsl;
        hsl.l -= 0.01;
        if (hsl.l < 0) hsl.l = 0;
        const newColor = Color.build(hsl);
        methods.handleSelectedColorChange(ColorChangeType.svl)(newColor);
    }

    const [isDecrementingL, setIsDecrementingL] = React.useState(false);

    useInterval(decrementL, isDecrementingL ? 100 : null);

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
                    {color.toString(settings)}
                    <IconButton size="small" onClick={() => methods.handleSwatchCopy(location)}>
                        <ContentCopyIcon />
                    </IconButton>
                    <IconButton size="small" onClick={methods.handlePaste}>
                        <ContentPasteIcon />
                    </IconButton>
                </ListItem>
                <ListItem className={styles.stretch} dense disablePadding disableGutters>
                    <SaturationPicker color={color} onChange={handleColorChange} />
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingR(true)}
                        onMouseUp={() => setIsDecrementingR(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    r: {color.rgb.r}
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingR(true)}
                        onMouseUp={() => setIsIncrementingR(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingG(true)}
                        onMouseUp={() => setIsDecrementingG(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    g: {color.rgb.g}
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingG(true)}
                        onMouseUp={() => setIsIncrementingG(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingB(true)}
                        onMouseUp={() => setIsDecrementingB(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    b: {color.rgb.b}
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingB(true)}
                        onMouseUp={() => setIsIncrementingB(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingH(true)}
                        onMouseUp={() => setIsDecrementingH(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    h: {color.hsv.h.toFixed(0)}
                    <IconButton size="small" onClick={methods.handleToggleHueLock}>
                        <CircleIcon
                            displayHorizontally={settings.isHorizontal}
                            isSelected={settings.isHueLocked}
                        />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingH(true)}
                        onMouseUp={() => setIsIncrementingH(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingS(true)}
                        onMouseUp={() => setIsDecrementingS(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    s: {color.hsv.s.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleSaturationLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isSaturationLocked}
                        />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingS(true)}
                        onMouseUp={() => setIsIncrementingS(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding disableGutters dense className={styles.center}>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingV(true)}
                        onMouseUp={() => setIsDecrementingV(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    v: {color.hsv.v.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleValueLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isValueLocked}
                        />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingV(true)}
                        onMouseUp={() => setIsIncrementingV(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsDecrementingL(true)}
                        onMouseUp={() => setIsDecrementingL(false)}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    l: {color.hsl.l.toFixed(2)}
                    <IconButton size="small" onClick={methods.handleToggleLightnessLock}>
                        <CircleIcon
                            displayHorizontally={!settings.isHorizontal}
                            isSelected={settings.isLightnessLocked}
                        />
                    </IconButton>
                    <IconButton size="small"
                        onMouseDown={() => setIsIncrementingL(true)}
                        onMouseUp={() => setIsIncrementingL(false)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Box>
    );
}