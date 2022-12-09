import React from 'react';
import ColorStub from '../ColorStub';
import Box from '@mui/material/Box';
import Palette from '../Palette';
import Settings, { UpdateMethods } from '../Settings';

import styles from './ColorPalette.module.scss';


interface ColorPaletteProps {
    className?: string | null,
    palette: Palette,
    settings: Settings,
    methods: UpdateMethods
}

export default function ColorPalette({
    className = null,
    palette,
    settings,
    methods
}: ColorPaletteProps) {
    const stubFr = palette.stubs.map((_, stubIndex): string => settings.selectedLocation?.stubIndex === stubIndex ? '4fr' : '1fr').join(' ')
    const gridTemplateColumns = settings.isHorizontal ? '1fr' : stubFr;
    const gridTemplateRows = settings.isHorizontal ? stubFr : '1fr';

    return (
        <Box
            sx={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows,
            }}
            className={`${className ?? ''} ${styles.colorPalette}`.trim()}>
            {palette.stubs.map((stub, index) => (
                <ColorStub
                    key={index}
                    stub={stub}
                    stubIndex={index}
                    settings={settings}
                    methods={methods}
                />
            ))}
        </Box>
    );
}