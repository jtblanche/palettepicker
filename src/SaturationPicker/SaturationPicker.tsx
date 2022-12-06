import React from 'react';
import Box from '@mui/material/Box';
import { HuePicker, ColorResult } from 'react-color';
import Hue from 'react-color/lib/components/common/Hue';
import Saturation from 'react-color/lib/components/common/Saturation';
import PointerBox from '../PointerBox';
import tinycolor, { ColorFormats } from 'tinycolor2';

interface SaturationPickerProps {
    tinyColor: tinycolor.Instance,
    onChange: ((result: tinycolor.Instance) => void) | null
}

export default function HueSlider({ tinyColor, onChange = null }: SaturationPickerProps) {
    const [color, setColor] = React.useState<tinycolor.Instance>(tinyColor);

    const handleColorChangeHsv = (hsvResult: ColorFormats.HSV, event: React.ChangeEvent<HTMLInputElement>) => {
        const newTinyColor = tinycolor(hsvResult);
        if (newTinyColor.toHex() == color.toHex()) return;
        if (onChange != null) {
            onChange(newTinyColor);
        }
        setColor(newTinyColor);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1', position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* @ts-ignore */}
            <Saturation pointer={() => (<PointerBox width={6} isCircle centerTop />)} onChange={handleColorChangeHsv} hsl={tinyColor.toHsl()} hsv={tinyColor.toHsv()} />
        </Box>
    );
}