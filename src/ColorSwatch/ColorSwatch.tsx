import React from 'react';
import ColorSwatchPicker from '../ColorSwatchPicker';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Swatch from '../Swatch';
import Settings, { UpdateMethods } from '../Settings';
import ColorLocation from '../ColorLocation';

import styles from './ColorSwatch.module.scss';

interface ColorSwatchProps {
    className?: string | null,
    swatch: Swatch,
    settings: Settings,
    location: ColorLocation,
    methods: UpdateMethods,
}

export default function ColorSwatch({
    className = null,
    swatch,
    settings,
    location,
    methods,
}: ColorSwatchProps) {
    const isCopied = location.equals(settings.copiedLocation);
    const isSelected = location.equals(settings.selectedLocation);
    const isShadeSelected = location.equalsSwatchIndexOnly(settings.selectedLocation);
    const isHueSelected = location.equalsStubIndexOnly(settings.selectedLocation);

    const brightnessClass = swatch.color.isDark ? styles.light : styles.dark;

    const showAnyEdges = isSelected || isHueSelected || isShadeSelected;
    const showHorizontalEdges = settings.isHorizontal ? isHueSelected : isShadeSelected;
    const showVerticalEdges = settings.isHorizontal ? isShadeSelected : isHueSelected;
    const containerClass = isSelected ? styles.colorContainerSelected
        : showHorizontalEdges ? styles.colorContainerHorizontalEdge
            : showVerticalEdges ? styles.colorContainerVerticalEdge
                : styles.colorContainer;
    const backgroundColor = swatch.color.toBackgroundColor(settings);

    return (
        <Box
            sx={{
                backgroundColor: showAnyEdges ? swatch.color.brightnessHex : 'white',
            }}
            className={`${className ?? ''} ${containerClass} ${brightnessClass}`.trim()} >
            {(isSelected || showHorizontalEdges) && (
                <Box
                    sx={{
                        backgroundColor: swatch.color.brightnessHex
                    }}
                    className={styles.horizontalTop}>
                    {isSelected && (
                        <IconButton size="small">
                            <KeyboardArrowUpIcon />
                        </IconButton>
                    )}
                </Box>
            )}
            {(isSelected || showVerticalEdges) && (
                <React.Fragment>
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.verticalLeft}>

                        {isSelected && (
                            <IconButton size="small">
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.verticalRight}>

                        {isSelected && (
                            <IconButton size="small">
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        )}
                    </Box>
                </React.Fragment>
            )}
            {(isSelected || showHorizontalEdges) && (
                <Box
                    sx={{
                        backgroundColor: swatch.color.brightnessHex
                    }}
                    className={styles.horizontalBottom}>

                    {isSelected && (
                        <IconButton size="small">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                </Box>
            )}
            <Box className={styles.borderBox}>
                <Box className={`${styles.colorSwatch} ${isCopied ? styles.copyBorder : ''}`.trim()}
                    onClick={() => methods.handleColorSelection(location)}
                    sx={{
                        backgroundColor: backgroundColor,
                    }}>
                    {isSelected ? <ColorSwatchPicker
                        color={swatch.color}
                        location={location}
                        settings={settings}
                        methods={methods}
                    /> : null}
                </Box>
            </Box>
        </Box >
    );
}