import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import HueSlider from './HueSlider';
import SaturationPicker from './SaturationPicker';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import PaletteIcon from '@mui/icons-material/Palette';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import { ChromePicker, ColorResult, HuePicker } from 'react-color';
import Saturation from 'react-color/lib/components/common/Saturation';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import tinycolor, { ColorFormats } from 'tinycolor2';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface coords {
  x: number;
  y: number;
}

export default function RecipeReviewCard() {

  const [open, setOpen] = React.useState(false)
  const [isEditingStubNumber, setIsEditingStubNumber] = React.useState(false)

  const [isHorizontal, setIsHorizontal] = React.useState((localStorage.getItem('isHorizontal') ?? 'false') === 'true')

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


  let handleColorChange = (x: number, y: number) => (color: tinycolor.Instance) => {
    let newStubs = stubs.map((stub) => [...stub]);
    if (isHueLocked || isSVLocked) {
      const newHsv = color.toHsv();
      newStubs = newStubs.map((stub, x2): Array<string> => {
        return stub.map((hex, y2): string => {
          const matchesHorizontal = y == y2;
          const matchesVertical = x == x2;
          const lockHue = isHueLocked && matchesVertical;
          const lockSV = isSVLocked && matchesHorizontal;
          if (!lockHue && !lockSV) return hex;
          const tinyColorHsv = tinycolor(hex).toHsv();
          const newTinyColor = tinycolor({
            h: (lockHue) ? newHsv.h : tinyColorHsv.h,
            s: (lockSV) ? newHsv.s : tinyColorHsv.s,
            v: (lockSV) ? newHsv.v : tinyColorHsv.v,
          });
          return `#${newTinyColor.toHex()}`;
        });
      });
    }
    if (isHorizontal) {
      newStubs[y][x] = `#${color.toHex()}`;
    } else {
      newStubs[x][y] = `#${color.toHex()}`;
    }
    updateAllStubs(newStubs, isHorizontal, false, copyCoords?.x! == x && copyCoords?.y! == y);
  };

  let handleColorPickerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  }

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
    const tinyColor = tinycolor(isHorizontal ? stubs[copyCoords?.y!][copyCoords?.x!] : stubs[copyCoords?.x!][copyCoords?.y!])
    handleColorChange(x, y)(tinyColor);
    setGlobalColor(tinyColor);
  }


  const [selectedCoords, setSelectedCoords] = React.useState<coords | null>(null)
  const updateSelectedCoords = (selected: coords | null = null) => {
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
    return orderedStubs[0].map((_, index) => (index == selectedCoords?.x) ? '4fr' : '1fr').join(' ');
  }

  let getGridTemplateRows = (): string => {
    return orderedStubs.map((_, index) => (index == selectedCoords?.y) ? '4fr' : '1fr').join(' ');
  }

  let displayColorPicker = (x: number, y: number) => selectedCoords?.x == x && selectedCoords?.y == y;

  const [globalColor, setGlobalColor] = React.useState<tinycolor.Instance>(tinycolor('#0000FF'));
  const updateGlobalColor = (tinyColor: tinycolor.Instance) => {
    if (selectedCoords != null) {
      handleColorChange(selectedCoords?.x!, selectedCoords?.y!)(tinyColor);
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
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={0}
                key={`${x},${y}`}
                onClick={() => updateSelectedCoords({ x, y })}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexGrow: 1,
                  backgroundColor: color,
                  border: (x == copyCoords?.x && y == copyCoords.y) ? '2px dashed' : 'none',
                  borderRadius: '5px'
                }}>
                {displayColorPicker(x, y) ?
                  <Box
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '5px', width: '90%', height: '90%', minHeight: '300px', minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
                    <List disablePadding>
                      <ListItem dense disablePadding>
                        <IconButton size="small" onClick={(event) => {
                          event.stopPropagation();
                          updateSelectedCoords();
                        }}>
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                    <Box sx={{ flexGrow: 1, minHeight: '150px' }}>
                      <SaturationPicker tinyColor={globalColor} onChange={handleColorChange(x, y)} />
                    </Box>
                    <List disablePadding>
                      <ListItem disablePadding disableGutters dense sx={{ justifyContent: "center" }}>
                        <IconButton size="small" onClick={copy(x, y)}>
                          <ContentCopyIcon />
                        </IconButton>
                        <IconButton size="small" onClick={paste(x, y)}>
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