import React from 'react';
import ColorSwatchPicker from '../ColorSwatchPicker';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
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
    const isTopMost = settings.isHorizontal ? location.stubIndex == 0 : location.swatchIndex == 0;
    const isLeftMost = settings.isHorizontal ? location.swatchIndex == 0 : location.stubIndex == 0;
    const isBottomMost = settings.isHorizontal
        ? location.stubIndex == settings.bottomRightLocation.stubIndex
        : location.swatchIndex == settings.bottomRightLocation.swatchIndex;
    const isRightMost = settings.isHorizontal
        ? location.swatchIndex == settings.bottomRightLocation.swatchIndex
        : location.stubIndex == settings.bottomRightLocation.stubIndex;

    const brightnessClass = swatch.color.isDark ? styles.light : styles.dark;

    const showAnyEdges = isSelected || isHueSelected || isShadeSelected;
    const showHorizontalEdges = settings.isHorizontal ? isHueSelected : isShadeSelected;
    const showVerticalEdges = settings.isHorizontal ? isShadeSelected : isHueSelected;
    const backgroundColor = swatch.color.toBackgroundColor(settings);

    const isTitleOfStub = location.swatchIndex == 0;
    const isTitleOfShade = location.stubIndex == 0;
    const isEndOfStub = location.swatchIndex == settings.bottomRightLocation.swatchIndex;
    const isEndOfShade = location.stubIndex == settings.bottomRightLocation.stubIndex;
    const showStubTitle = (isSelected || isHueSelected) && isTitleOfStub;
    const showShadeTitle = (isSelected || isShadeSelected) && isTitleOfShade;
    const showTopEdge = isSelected || (settings.isHorizontal
        ? (isHueSelected || showShadeTitle)
        : (isShadeSelected || showStubTitle));
    const showBottomEdge = isSelected || (settings.isHorizontal
        ? (isHueSelected || (isShadeSelected && isEndOfShade))
        : (isShadeSelected || (isHueSelected && isEndOfStub)));
    const showLeftEdge = isSelected || (settings.isHorizontal
        ? (isShadeSelected || showStubTitle)
        : (isHueSelected || showShadeTitle));
    const showRightEdge = isSelected || (settings.isHorizontal
        ? (isShadeSelected || (isHueSelected && isEndOfStub))
        : (isHueSelected || (isShadeSelected && isEndOfShade)));
    const containerClassStr = `colorContainer${showTopEdge ? 'Top' : ''}${showLeftEdge ? 'Left' : ''}${showBottomEdge ? 'Bottom' : ''}${showRightEdge ? 'Right' : ''}`;
    /* @ts-ignore */
    const containerClass = styles[containerClassStr];

    return (
        <Box
            sx={{
                backgroundColor: showAnyEdges ? swatch.color.brightnessHex : 'white',
            }}
            className={`${className ?? ''} ${containerClass} ${brightnessClass}`.trim()} >
            {showTopEdge && (
                <Box
                    sx={{
                        backgroundColor: swatch.color.brightnessHex
                    }}
                    className={styles.horizontalTop}>
                    {settings.isHorizontal && showShadeTitle && (
                        <React.Fragment>
                            <IconButton size="small" color="inherit" onClick={methods.removeShade}>
                                <DeleteIcon />
                            </IconButton>
                            {/* <IconButton size="small" color="inherit">
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                                <KeyboardArrowRightIcon />
                            </IconButton> */}
                            <IconButton size="small" color="inherit" onClick={methods.addShade}>
                                <AddIcon />
                            </IconButton>
                        </React.Fragment>
                    )}
                    {!settings.isHorizontal && showStubTitle && (
                        <React.Fragment>
                            <IconButton size="small" color="inherit" onClick={methods.removeStub}>
                                <DeleteIcon />
                            </IconButton>
                            {/* <IconButton size="small" color="inherit">
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton size="small" color="inherit">
                                <KeyboardArrowRightIcon />
                            </IconButton> */}
                            <IconButton size="small" color="inherit" onClick={methods.addStub}>
                                <AddIcon />
                            </IconButton>
                        </React.Fragment>
                    )}
                </Box>
            )
            }
            {
                showLeftEdge && (
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.verticalLeft}>

                        {settings.isHorizontal && showStubTitle && (
                            <React.Fragment>
                                <IconButton size="small" color="inherit" onClick={methods.removeStub}>
                                    <DeleteIcon />
                                </IconButton>
                                {/* <IconButton size="small" color="inherit">
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                <IconButton size="small" color="inherit">
                                    <KeyboardArrowDownIcon />
                                </IconButton> */}
                                <IconButton size="small" color="inherit" onClick={methods.addStub}>
                                    <AddIcon />
                                </IconButton>
                            </React.Fragment>
                        )}
                        {!settings.isHorizontal && showShadeTitle && (
                            <React.Fragment>
                                <IconButton size="small" color="inherit" onClick={methods.removeShade}>
                                    <DeleteIcon />
                                </IconButton>
                                {/* <IconButton size="small" color="inherit">
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                <IconButton size="small" color="inherit">
                                    <KeyboardArrowDownIcon />
                                </IconButton> */}
                                <IconButton size="small" color="inherit" onClick={methods.addShade}>
                                    <AddIcon />
                                </IconButton>
                            </React.Fragment>
                        )}
                    </Box>
                )
            }
            {
                showRightEdge && (
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.verticalRight}>
                    </Box>
                )
            }
            {
                showBottomEdge && (
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.horizontalBottom}>
                    </Box>
                )
            }
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