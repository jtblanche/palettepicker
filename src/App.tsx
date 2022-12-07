import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ColorSwatch from './ColorSwatch';
import HueSlider from './HueSlider';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import PaletteColor, { PaletteColorDisplayType } from './PaletteColor';
import PaletteIcon from '@mui/icons-material/Palette';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import tinycolor from 'tinycolor2';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './App.scss';

interface coords {
  x: number;
  y: number;
}

export default function RecipeReviewCard() {

  const [open, setOpen] = React.useState(false)
  const [isEditingStubNumber, setIsEditingStubNumber] = React.useState(false)

  const [isHorizontal, setIsHorizontal] = React.useState((localStorage.getItem('isHorizontal') ?? 'false') === 'true')

  const [isBrightnessMode, setIsBrightnessMode] = React.useState((localStorage.getItem('isBrightnessMode') ?? 'false') === 'true')

  const [isHueLocked, setIsHueLocked] = React.useState((localStorage.getItem('isHueLocked') ?? 'false') === 'true')

  const [isSVLocked, setIsSVLocked] = React.useState((localStorage.getItem('isSVLocked') ?? 'false') === 'true')

  const [stubNumber, setStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const [nextStubNumber, setNextStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const [copyCoords, setCopyCoords] = React.useState<coords | null>(null)

  const defaultStubs: Array<Array<string>> = [
    [
      "#951F27",
      "#EF5C5A",
      "#FFA7A5",
      "#FFEEEE"
    ],
    [
      "#E95E00",
      "#FFA427",
      "#FFDAA4",
      "#FFF5EA"
    ],
    [
      "#998A25",
      "#E0D100",
      "#F4E770",
      "#FFFFF9"
    ],
    [
      "#005E01",
      "#40BE4B",
      "#BAF299",
      "#F4FFF0"
    ],
    [
      "#05327F",
      "#2776FF",
      "#95CDFF",
      "#EFF8FD"
    ],
    [
      "#522778",
      "#9E57FF",
      "#D1AAFF",
      "#FBEEFF"
    ],
  ];

  const [stubs, setStubs] = React.useState<Array<Array<string>>>(JSON.parse(localStorage.getItem('stubs') ?? 'null') ?? defaultStubs);

  const getStubs = (isHorizontal: boolean, stubbers: Array<Array<string>> | null = null): Array<Array<string>> => {
    const newStubs: Array<Array<string>> = [];
    const oldStubs = stubbers ?? stubs;
    if (isHorizontal) {
      for (let x = 0; x < oldStubs.length; x++) {
        const newStub: Array<string> = [];
        newStubs[x] = newStub;
        const stub = oldStubs[x];
        for (let y = 0; y < stub.length; y++) {
          const color = stub[y];
          newStubs[x][y] = color;
        }
      }
    } else {
      for (let x = 0; x < oldStubs.length; x++) {
        const stub = oldStubs[x];
        for (let y = 0; y < stub.length; y++) {
          if (newStubs[y] == null) {
            const newStub: Array<string> = [];
            newStubs[y] = newStub;
          }
          const color = stub[y];
          newStubs[y][x] = color;
        }
      }
    }
    return newStubs;
  }

  const saveStubs = (newStubs: Array<Array<string>>) => {
    localStorage.setItem('stubs', JSON.stringify(newStubs))
  }

  const updateAllStubs = (stubs: Array<Array<string>>, isHorizontal: boolean, resetSelection: boolean = false, resetCopy: boolean = false) => {
    setStubs(stubs);
    saveStubs(stubs);
    setOrderedStubs(getStubs(isHorizontal, stubs));
    if (resetSelection) {
      updateSelectedCoords();
    }
    if (resetCopy) {
      setCopyCoords(null);
    }
  }

  const [orderedStubs, setOrderedStubs] = React.useState(getStubs(isHorizontal));


  let handleColorChange = (x: number, y: number) => (color: PaletteColor) => {
    let newStubs = stubs.map((stub) => [...stub]);
    if (isHueLocked || isSVLocked) {
      newStubs = newStubs.map((stub, x2): Array<string> => {
        return stub.map((hex, y2): string => {
          const matchesHorizontal = y === y2;
          const matchesVertical = x === x2;
          const matchesOppositeHorizontal = y === x2;
          const matchesOppositeVertical = x === y2;
          const lockHue = isHueLocked && ((!isHorizontal && matchesVertical) || (isHorizontal && matchesOppositeHorizontal));
          const lockSV = isSVLocked && ((!isHorizontal && matchesHorizontal) || (isHorizontal && matchesOppositeVertical));
          if (!lockHue && !lockSV) return hex;
          let newColor = PaletteColor.build(color.displayAs, hex);
          if (lockHue) {
            newColor = newColor.buildNewFromHue(color);
          }
          if (lockSV) {
            newColor = newColor.buildNewFromSaturationAndValue(color);
          }
          return newColor.hex;
        });
      });
    }
    if (isHorizontal) {
      newStubs[y][x] = color.hex;
    } else {
      newStubs[x][y] = color.hex;
    }
    updateAllStubs(newStubs, isHorizontal, false, copyCoords?.x! === x && copyCoords?.y! === y);
  };

  const onUpdateStubNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.validity', e.target.validity.valid);
    if (e.target.validity.valid || e.target.value === '') setNextStubNumber(e.target.value)
  }

  const handleToggleDirection = () => {
    const newIsHorizontal = !isHorizontal;
    setIsHorizontal(newIsHorizontal);
    localStorage.setItem('isHorizontal', newIsHorizontal.toString())
    updateSelectedCoords();
    setOrderedStubs(getStubs(newIsHorizontal));
  }

  const handleToggleHueLock = () => {
    const newIsHueLocked = !isHueLocked;
    setIsHueLocked(newIsHueLocked);
    localStorage.setItem('isHueLocked', newIsHueLocked.toString())
  }

  const handleToggleSVLock = () => {
    const newIsSVLocked = !isSVLocked;
    setIsSVLocked(newIsSVLocked);
    localStorage.setItem('isSVLocked', newIsSVLocked.toString())
  }

  const handleToggleIsBrightnessMode = () => {
    const newIsBrightnessMode = !isBrightnessMode;
    setIsBrightnessMode(newIsBrightnessMode);
    localStorage.setItem('isBrightnessMode', newIsBrightnessMode.toString())
  }

  const handleToggleEditStubNumber = () => {
    const newIsEditingStubNumber = !isEditingStubNumber;
    setIsEditingStubNumber(newIsEditingStubNumber);
    if (!newIsEditingStubNumber) {
      if (nextStubNumber <= 10 && nextStubNumber >= 1) {
        setStubNumber(nextStubNumber);
        localStorage.setItem('stubNumber', nextStubNumber);
        changeStubNumber(nextStubNumber);
      } else {
        setNextStubNumber(stubNumber);
      }
    }
  }

  const changeStubNumber = (stubNumber: number) => {
    const newStubs = stubs.map((stub) => [
      ...stub.filter((_, index) => index < stubNumber),
      ...((stub.length < stubNumber) ? (Array(stubNumber - stub.length).fill(stub[stub.length - 1])) : [])
    ]);
    updateAllStubs(newStubs, isHorizontal, true, true);
  }

  const addStub = () => {
    const selectedOrEnd: number = ((isHorizontal) ? selectedCoords?.y : selectedCoords?.x) ?? (stubs.length - 1);
    const newStubs = [
      ...stubs.filter((_, index) => index <= selectedOrEnd).map((stub) => [...stub]),
      [...stubs[selectedOrEnd]],
      ...stubs.splice(selectedOrEnd + 1).map((stub) => [...stub])
    ]
    updateAllStubs(newStubs, isHorizontal, false, true);
  }

  const removeStub = () => {
    const selectedOrEnd: number = ((isHorizontal) ? selectedCoords?.y : selectedCoords?.x) ?? (stubs.length - 1);
    const newStubs = [
      ...stubs.filter((_, index) => index < selectedOrEnd).map((stub) => [...stub]),
      ...stubs.splice(selectedOrEnd + 1).map((stub) => [...stub])
    ]
    updateAllStubs(newStubs, isHorizontal, true, true);
  }

  const copy = (x: number, y: number) => () => {
    setCopyCoords({ x: x, y: y });
  }

  const paste = (x: number, y: number) => () => {
    if (copyCoords?.x == null || copyCoords?.y == null) return;
    const color = PaletteColor.build(isBrightnessMode ? PaletteColorDisplayType.Brightness : PaletteColorDisplayType.Hex, isHorizontal ? stubs[copyCoords?.y!][copyCoords?.x!] : stubs[copyCoords?.x!][copyCoords?.y!])
    handleColorChange(x, y)(color);
    setGlobalColor(color.tinycolor);
  }


  const [selectedCoords, setSelectedCoords] = React.useState<coords | null>(null)
  const updateSelectedCoords = (selected: coords | null = null) => () => {
    setSelectedCoords(selected);
    if (selected != null) {
      let tinyColor: tinycolor.Instance | null = null;
      if (isHorizontal) {
        tinyColor = tinycolor(stubs[selected?.y!][selected?.x!]);
      } else {
        tinyColor = tinycolor(stubs[selected?.x!][selected?.y!]);
      }
      setGlobalColor(tinyColor!);
    }
  }

  let getGridTemplateColumns = (): string => {
    return orderedStubs[0].map((_, index) => (index === selectedCoords?.x) ? '4fr' : '1fr').join(' ');
  }

  let getGridTemplateRows = (): string => {
    return orderedStubs.map((_, index) => (index === selectedCoords?.y) ? '4fr' : '1fr').join(' ');
  }

  const [globalColor, setGlobalColor] = React.useState<tinycolor.Instance>(tinycolor('#0000FF'));
  const updateGlobalColor = (tinyColor: tinycolor.Instance) => {
    if (selectedCoords != null) {
      handleColorChange(selectedCoords?.x!, selectedCoords?.y!)(PaletteColor.build(isBrightnessMode ? PaletteColorDisplayType.Brightness : PaletteColorDisplayType.Hex, tinyColor));
    }
    setGlobalColor(tinyColor);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <PaletteIcon sx={{ marginRight: 3 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex' }}>
            Palette Picker
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="Add a color stub"
              onClick={addStub}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label={(selectedCoords?.x == null) ? "Remove last color stub." : "Remove selected color stub."}
              onClick={removeStub}
            >
              <RemoveIcon />
            </IconButton>
            {/* <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={console.log}
              color="inherit"
            >
              <NavigateNextIcon />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <Box sx={{
          width: '100%'
        }}>
          {/* @ts-ignore */}
          <HueSlider tinyColor={globalColor} onChange={updateGlobalColor} />
          {/* @ts-ignore */}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: getGridTemplateColumns(),
            gridTemplateRows: getGridTemplateRows(),
            height: '100%'
          }}>
          {orderedStubs.map((stub, y) =>
            stub.map((color, x) =>
              <ColorSwatch
                key={`${x},${y}`}
                color={PaletteColor.build(isBrightnessMode ? PaletteColorDisplayType.Brightness : PaletteColorDisplayType.Hex, color)}
                isCopied={copyCoords?.x === x && copyCoords?.y === y}
                isSelected={selectedCoords?.x === x && selectedCoords?.y === y}
                onChange={handleColorChange(x, y)}
                onCopy={copy(x, y)}
                onDeselect={updateSelectedCoords()}
                onPaste={paste(x, y)}
                onSelect={updateSelectedCoords({ x, y })}
              />
            )
          )}
        </Box>
      </Box>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box
          sx={{ width: 300 }}
          role="presentation"
        >
          <Box sx={{ margin: 2 }}>
            <Typography variant="h4" component="h1">
              Options
            </Typography>
          </Box>
          <List>
            <ListItem
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggleDirection}
                  checked={isHorizontal}
                  inputProps={{ 'aria-labelledby': 'toggleDirection' }}
                />
              }
            >
              <ListItemButton role={undefined} onClick={handleToggleDirection} dense>
                <ListItemText id={'toggleDirection'} primary={'Show colors horizontally'} />
              </ListItemButton>
            </ListItem>
            <ListItem
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggleIsBrightnessMode}
                  checked={isBrightnessMode}
                  inputProps={{ 'aria-labelledby': 'toggleBrightnessMode' }}
                />
              }
            >
              <ListItemButton role={undefined} onClick={handleToggleIsBrightnessMode} dense>
                <ListItemText id={'toggleBrightnessMode'} primary={'Show estimated brightness'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock saturation and value" onClick={handleToggleSVLock}>
                {!isSVLocked &&
                  <LockOpenIcon />
                }
                {isSVLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleSVLock} dense>
                <ListItemText primary={'Lock saturation and value'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock hue" onClick={handleToggleHueLock}>
                {!isHueLocked &&
                  <LockOpenIcon />
                }
                {isHueLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleHueLock} dense>
                <ListItemText primary={'Lock hue'} />
              </ListItemButton>
            </ListItem>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="update stub number" onClick={handleToggleEditStubNumber}>
                  {!isEditingStubNumber &&
                    <EditIcon />
                  }
                  {isEditingStubNumber &&
                    <SaveIcon />
                  }
                </IconButton>
              }>
              {!isEditingStubNumber &&
                <ListItemButton role={undefined} onClick={handleToggleEditStubNumber} dense>
                  <ListItemText primary={'Update color stub count'} />
                </ListItemButton>
              }
              {isEditingStubNumber &&
                <TextField
                  // error={triedToAdd && !newItemTextIsValid}
                  // helperText={(triedToAdd && !newItemTextIsValid) ? "*This field is required and cannot be any previous tasks" : ""}
                  fullWidth
                  type="number"
                  label="Set color stub count (1-10)"
                  variant="standard"
                  InputProps={{
                    inputProps: {
                      pattern: "[1-9]|10",
                      min: 1,
                      max: 10,
                    }
                  }}
                  onChange={onUpdateStubNumber}
                  // onKeyDown={handleKeyDown}
                  value={nextStubNumber}
                />
              }
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </Box >
  );
}