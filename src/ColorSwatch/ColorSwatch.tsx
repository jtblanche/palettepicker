import React from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PaletteColor from '../PaletteColor';
import SaturationPicker from '../SaturationPicker';

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
    const handleColorChange = (newColor: PaletteColor) => {
        if (newColor.equals(color)) return;
        onChange(newColor);
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={0}
            onClick={onSelect}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                backgroundColor: color.backgroundColor,
                border: (isCopied) ? '2px dashed' : 'none',
                borderRadius: '5px'
            }}>
            {isSelected ?
                <Box
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '5px', width: '80%', height: '80%', minHeight: '300px', minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
                    <List disablePadding>
                        <ListItem dense disablePadding>
                            <IconButton size="small" onClick={(event) => {
                                event.stopPropagation();
                                onDeselect();
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </ListItem>
                    </List>
                    <Box sx={{ flexGrow: 1, minHeight: '150px' }}>
                        <SaturationPicker color={color} onChange={handleColorChange} />
                    </Box>
                    <List disablePadding>
                        <ListItem disablePadding disableGutters dense sx={{ justifyContent: "center" }}>
                            <IconButton size="small" onClick={onCopy}>
                                <ContentCopyIcon />
                            </IconButton>
                            <IconButton size="small" onClick={onPaste}>
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
                </Box> : null}
        </Grid>
    );
}