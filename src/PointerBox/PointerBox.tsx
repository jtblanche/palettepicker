import React from 'react';
import Box from '@mui/material/Box';

interface PointerBoxProps {
    width: number,
    height: number | null,
    border: number,
    isCircle: boolean,
    centerTop: boolean
}

export default function PointerBox({ width = 10, height = null, border = 2, isCircle = false, centerTop = false }: PointerBoxProps) {
    return <Box sx={{
        width: `${width - 2 * border}px`,
        height: (height != null) ? `${height - 2 * border}px` : `${width - 2 * border}px`,
        marginLeft: `-${(width / 2) + border}px`,
        marginTop: (centerTop) ? `-${(width / 2) + border}px` : null,
        border: `${border}px solid white`,
        borderRadius: (isCircle) ? `${(width / 2) + border}px` : '3px',
    }}>
    </Box>;
}