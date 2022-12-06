import React from 'react';
import Box from '@mui/material/Box';
import { HuePicker, ColorResult } from 'react-color';
import Hue from 'react-color/lib/components/common/Hue';
import Saturation from 'react-color/lib/components/common/Saturation';
import PointerBox from '../PointerBox';
import tinycolor, { ColorFormats } from 'tinycolor2';

interface HueSliderProps {
    tinyColor: tinycolor.Instance,
    onChange: ((result: tinycolor.Instance) => void) | null
}

export default function HueSlider({ tinyColor, onChange = null }: HueSliderProps) {
    const [color, setColor] = React.useState<tinycolor.Instance>(tinyColor);

    const handleColorChangeHsl = (hslResult: ColorFormats.HSL, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTinyColor = tinycolor(hslResult);
        if (newTinyColor.toHex() == color.toHex()) return;
        if (onChange != null) {
            onChange(newTinyColor);
        }
        setColor(newTinyColor);
    };

    return (
        <Box sx={{ height: '50px', position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <Hue pointer={() => (<PointerBox height={50} />)} onChange={handleColorChangeHsl} hsl={tinyColor.toHsl()} />
        </Box>
    );
}