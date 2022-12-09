import React from 'react';
import Box from '@mui/material/Box';
import Hue from 'react-color/lib/components/common/Hue';
import PointerBox from '../PointerBox';
import { ColorFormats } from 'tinycolor2';
import Color, { ColorDisplayType } from '../Color';

interface HueSliderProps {
    color: Color,
    onChange: (result: Color) => void
}

export default function HueSlider({ color, onChange }: HueSliderProps) {
    const handleColorChangeHsl = (hslResult: ColorFormats.HSL) => {
        const newColor = color.buildNewFromHue(Color.build(hslResult));
        if (newColor.equals(color)) return;
        onChange(newColor);
    };

    return (
        <Box sx={{ height: '50px', position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <Hue pointer={() => (<PointerBox height={50} />)} onChange={handleColorChangeHsl} hsl={color.hsl} hsv={color.hsv} />
        </Box>
    );
}