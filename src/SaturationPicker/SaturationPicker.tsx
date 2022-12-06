import React from 'react';
import Box from '@mui/material/Box';
import PaletteColor from '../PaletteColor';
import Saturation from 'react-color/lib/components/common/Saturation';
import PointerBox from '../PointerBox';
import { ColorFormats } from 'tinycolor2';

interface SaturationPickerProps {
    color: PaletteColor,
    onChange: ((result: PaletteColor) => void) | null
}

export default function HueSlider({ color, onChange = null }: SaturationPickerProps) {
    const handleColorChangeHsv = (hsvResult: ColorFormats.HSV, event: React.ChangeEvent<HTMLInputElement>) => {
        const newPaletteColor = PaletteColor.build(color.displayAs, hsvResult);
        if (newPaletteColor.equals(color)) return;
        if (onChange != null) {
            onChange(newPaletteColor);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1', position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <Saturation pointer={() => (<PointerBox width={6} isCircle centerTop />)} onChange={handleColorChangeHsv} hsl={color.hsl} hsv={color.hsv} />
        </Box>
    );
}