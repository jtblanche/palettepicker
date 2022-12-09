import React from 'react';
import ColorSwatchPicker from '../ColorSwatchPicker';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
    const thisIsNull = swatch.isCopied ? console.log('swatch copied') : null;

    const brightnessClass = swatch.color.isDark ? styles.light : styles.dark;

    const showAnyEdges = swatch.isSelected || swatch.isHueSelected || swatch.isShadeSelected;
    const showHorizontalEdges = swatch.isHorizontal ? swatch.isHueSelected : swatch.isShadeSelected;
    const showVerticalEdges = swatch.isHorizontal ? swatch.isShadeSelected : swatch.isHueSelected;
    const containerClass = swatch.isSelected ? styles.colorContainerSelected
        : showHorizontalEdges ? styles.colorContainerHorizontalEdge
            : showVerticalEdges ? styles.colorContainerVerticalEdge
                : styles.colorContainer;

    return (
        <Box
            sx={{
                backgroundColor: showAnyEdges ? swatch.color.brightnessHex : 'white',
            }}
            className={`${className ?? ''} ${containerClass} ${brightnessClass}`.trim()} >
            {(swatch.isSelected || showHorizontalEdges) && (
                <Box
                    sx={{
                        backgroundColor: swatch.color.brightnessHex
                    }}
                    className={styles.horizontalTop}>
                    {swatch.isSelected && (
                        <IconButton size="small">
                            <KeyboardArrowUpIcon />
                        </IconButton>
                    )}
                </Box>
            )}
            {(swatch.isSelected || showVerticalEdges) && (
                <React.Fragment>
                    <Box
                        sx={{
                            backgroundColor: swatch.color.brightnessHex
                        }}
                        className={styles.verticalLeft}>

                        {swatch.isSelected && (
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

                        {swatch.isSelected && (
                            <IconButton size="small">
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        )}
                    </Box>
                </React.Fragment>
            )}
            {(swatch.isSelected || showHorizontalEdges) && (
                <Box
                    sx={{
                        backgroundColor: swatch.color.brightnessHex
                    }}
                    className={styles.horizontalBottom}>

                    {swatch.isSelected && (
                        <IconButton size="small">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                </Box>
            )}
            <Box className={styles.borderBox}>
                <Box className={`${styles.colorSwatch} ${swatch.isCopied ? styles.copyBorder : ''}`.trim()}
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
            </Box>
        </Box >
    );
}