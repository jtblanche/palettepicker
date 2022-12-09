import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ColorPalette from '../ColorPalette';
import HueSlider from '../HueSlider';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import Color, { ColorDisplayType } from '../Color';
import Palette, { ColorChangeType } from '../Palette';
import ColorLocation from '../ColorLocation';
import PaletteIcon from '@mui/icons-material/Palette';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Settings, { UpdateMethods } from '../Settings';

import './App.scss';

export default function RecipeReviewCard() {
  const [open, setOpen] = React.useState(false);

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

  const _initialSettings = Settings.build(
    ((localStorage.getItem('isBrightnessMode') ?? 'false') === 'true')
      ? ColorDisplayType.Brightness
      : ColorDisplayType.Hex,
    {
      isHorizontal: (localStorage.getItem('isHorizontal') ?? 'false') === 'true',
      isHueLocked: (localStorage.getItem('isHueLocked') ?? 'false') === 'true',
      isSaturationLocked: (localStorage.getItem('isSaturationLocked') ?? 'false') === 'true',
      isValueLocked: (localStorage.getItem('isValueLocked') ?? 'false') === 'true',
      isLightnessLocked: (localStorage.getItem('isLightnessLocked') ?? 'false') === 'true',
    }
  );

  const [palette, setPalette] = React.useState(Palette.build(
    JSON.parse(localStorage.getItem('stubs') ?? 'null') ?? defaultStubs,
    _initialSettings
  ));

  const [settings, setSettings] = React.useState(_initialSettings);

  const [isEditingStubNumber, setIsEditingStubNumber] = React.useState(false)

  const [stubNumber, setStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const [nextStubNumber, setNextStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const onUpdateStubNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.validity', e.target.validity.valid);
    if (e.target.validity.valid || e.target.value === '') setNextStubNumber(e.target.value)
  }

  const handleToggleDirection = () => {
    setSettings(oldSettings => {
      const newIsHorizontal = !oldSettings.isHorizontal;
      localStorage.setItem('isHorizontal', newIsHorizontal.toString());
      return oldSettings.buildNewFromIsHorizontal(newIsHorizontal)
    });
  }

  const handleToggleHueLock = () => {
    setSettings(oldSettings => {
      const newIsHueLocked = !oldSettings.isHueLocked;
      localStorage.setItem('isHueLocked', newIsHueLocked.toString());
      return oldSettings.buildNewFromIsHueLocked(newIsHueLocked);
    });
  }

  const handleSwatchCopy = (location: ColorLocation) => {
    setSettings(oldSettings => oldSettings.buildNewFromSaveToClipboard(location, palette));
  }

  const handleToggleSaturationLock = () => {
    setSettings(oldSettings => {
      const newIsSVLocked = !oldSettings.isSaturationLocked;
      localStorage.setItem('isSaturationLocked', newIsSVLocked.toString());
      return oldSettings.buildNewFromIsSaturationLocked(newIsSVLocked);
    });
  }

  const handleToggleValueLock = () => {
    setSettings(oldSettings => {
      const newIsSVLocked = !oldSettings.isValueLocked;
      localStorage.setItem('isValueLocked', newIsSVLocked.toString());
      return oldSettings.buildNewFromIsValueLocked(newIsSVLocked);
    });
  }

  const handleToggleLightnessLock = () => {
    setSettings(oldSettings => {
      const newIsSVLocked = !oldSettings.isLightnessLocked;
      localStorage.setItem('isLightnessLocked', newIsSVLocked.toString());
      return oldSettings.buildNewFromIsLightnessLocked(newIsSVLocked);
    });
  }

  const handleToggleIsBrightnessMode = () => {
    setSettings(oldSettings => {
      const newIsBrightnessMode = !(oldSettings.displayAs === ColorDisplayType.Brightness);
      localStorage.setItem('isBrightnessMode', newIsBrightnessMode.toString());
      return oldSettings.buildNewFromDisplayAs(newIsBrightnessMode ? ColorDisplayType.Brightness : ColorDisplayType.RGB)
    });
  }

  const handleColorSelection = (location: ColorLocation) => {
    setSettings(oldSettings => oldSettings.buildNewFromSelection(location, palette));
  }

  const handleColorDeselection = () => {
    setSettings(oldSettings => oldSettings.buildNewFromDeselection());
  }

  const handleSelectedColorChange = (changeType: ColorChangeType) => (color: Color) => {
    setPalette(oldPalette => {
      const newPalette = oldPalette.buildNewFromColor(color, changeType, settings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return newPalette;
    });
    setSettings(oldSettings => oldSettings.buildNewFromGlobalColor(color, changeType));
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
    // const newStubs = stubs.map((stub) => [
    //   ...stub.filter((_, index) => index < stubNumber),
    //   ...((stub.length < stubNumber) ? (Array(stubNumber - stub.length).fill(stub[stub.length - 1])) : [])
    // ]);
    // updateAllStubs(newStubs, isHorizontal, true, true);
  }

  const addStub = () => {
    setPalette(oldPalette => {
      const newPalette = oldPalette.buildNewFromAddNewStub(settings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return newPalette;
    });
  }

  const removeStub = () => {
    setPalette(oldPalette => {
      const newPalette = oldPalette.buildNewFromRemoveStub(settings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return newPalette;
    });
  }

  const methods: UpdateMethods = {
    handleToggleDirection,
    handleToggleHueLock,
    handleSwatchCopy,
    handleToggleSaturationLock,
    handleToggleValueLock,
    handleToggleLightnessLock,
    handleToggleIsBrightnessMode,
    handleColorSelection,
    handleColorDeselection,
    handleSelectedColorChange,
    handleToggleEditStubNumber,
    changeStubNumber,
    addStub,
    removeStub,
  };

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
              aria-label={/*(selectedCoords?.x == null) ?*/ "Remove last color stub." /*: "Remove selected color stub."*/}
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
          <HueSlider color={settings.globalColor} onChange={handleSelectedColorChange(ColorChangeType.hue)} />
          {/* @ts-ignore */}
        </Box>
        <ColorPalette
          palette={palette}
          settings={settings}
          methods={methods}
        />
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
                  checked={settings.isHorizontal}
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
                  checked={settings.displayAs === ColorDisplayType.Brightness}
                  inputProps={{ 'aria-labelledby': 'toggleBrightnessMode' }}
                />
              }
            >
              <ListItemButton role={undefined} onClick={handleToggleIsBrightnessMode} dense>
                <ListItemText id={'toggleBrightnessMode'} primary={'Show estimated brightness'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock saturation" onClick={handleToggleSaturationLock}>
                {!settings.isSaturationLocked &&
                  <LockOpenIcon />
                }
                {settings.isSaturationLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleSaturationLock} dense>
                <ListItemText primary={'Lock saturation'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock value" onClick={handleToggleValueLock}>
                {!settings.isValueLocked &&
                  <LockOpenIcon />
                }
                {settings.isValueLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleValueLock} dense>
                <ListItemText primary={'Lock value'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock lightness" onClick={handleToggleLightnessLock}>
                {!settings.isLightnessLocked &&
                  <LockOpenIcon />
                }
                {settings.isLightnessLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleLightnessLock} dense>
                <ListItemText primary={'Lock lightness'} />
              </ListItemButton>
            </ListItem>
            <ListItem secondaryAction={
              <IconButton edge="end" aria-label="Lock hue" onClick={handleToggleHueLock}>
                {!settings.isHueLocked &&
                  <LockOpenIcon />
                }
                {settings.isHueLocked &&
                  <LockIcon />
                }
              </IconButton>
            }>
              <ListItemButton role={undefined} onClick={handleToggleHueLock} dense>
                <ListItemText primary={'Lock hue'} />
              </ListItemButton>
            </ListItem>
            {/* <ListItem
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
            </ListItem> */}
          </List>
        </Box>
      </SwipeableDrawer>
    </Box >
  );
}