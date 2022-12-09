import React from 'react';
import ColorSwatch from '../ColorSwatch';
import Box from '@mui/material/Box';
import Stub from '../Stub';

import styles from './ColorStub.module.scss';
import Settings, { UpdateMethods } from '../Settings';
import ColorLocation from '../ColorLocation';


interface ColorStubProps {
    className?: string | null,
    stub: Stub,
    settings: Settings,
    stubIndex: number,
    methods: UpdateMethods,
}

export default function ColorStub({
    className = null,
    stub,
    settings,
    stubIndex,
    methods
}: ColorStubProps) {
    const location = (swatchIndex: number): ColorLocation => new ColorLocation(stubIndex, swatchIndex);

    const swatchesFr = stub.swatches.map((_, swatchIndex): string =>
        (settings.selectedLocation?.swatchIndex === swatchIndex) ? '4fr' : '1fr'
    ).join(' ');
    const gridTemplateColumns = settings.isHorizontal ? swatchesFr : '1fr';
    const gridTemplateRows = settings.isHorizontal ? '1fr' : swatchesFr;

    return (
        <Box
            sx={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows,
            }}
            className={`${className ?? ''} ${styles.colorStub}`.trim()}>
            {stub.swatches.map((swatch, index) => (
                <ColorSwatch
                    key={index}
                    swatch={swatch}
                    settings={settings}
                    location={location(index)}
                    methods={methods}
                />
            ))}
        </Box>
    );
}