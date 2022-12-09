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
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Settings, { UpdateMethods } from '../Settings';

import './App.scss';

interface AppState {
  settings: Settings,
  palette: Palette
}

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

  const _initialStubs = JSON.parse(localStorage.getItem('stubs') ?? 'null') ?? defaultStubs;

  const _initialSettings = Settings.build(
    ((localStorage.getItem('isBrightnessMode') ?? 'false') === 'true')
      ? ColorDisplayType.Brightness
      : ColorDisplayType.Hex,
    new ColorLocation(
      _initialStubs.length - 1,
      _initialStubs[0].length - 1
    ),
    {
      isHorizontal: (localStorage.getItem('isHorizontal') ?? 'false') === 'true',
      isHueLocked: (localStorage.getItem('isHueLocked') ?? 'false') === 'true',
      isSaturationLocked: (localStorage.getItem('isSaturationLocked') ?? 'false') === 'true',
      isValueLocked: (localStorage.getItem('isValueLocked') ?? 'false') === 'true',
      isLightnessLocked: (localStorage.getItem('isLightnessLocked') ?? 'false') === 'true',
    }
  );

  const [{ settings, palette }, setState] = React.useState<AppState>({
    palette: Palette.build(
      _initialStubs,
      _initialSettings
    ), settings: _initialSettings
  });

  const [isEditingStubNumber, setIsEditingStubNumber] = React.useState(false)

  const [stubNumber, setStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const [nextStubNumber, setNextStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '4'));

  const onUpdateStubNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.validity', e.target.validity.valid);
    if (e.target.validity.valid || e.target.value === '') setNextStubNumber(e.target.value)
  }

  const handleToggleDirection = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsHorizontal = !oldSettings.isHorizontal;
      localStorage.setItem('isHorizontal', newIsHorizontal.toString());
      return {
        settings: oldSettings.buildNewFromIsHorizontal(newIsHorizontal),
        palette
      }
    });
  }

  const handleToggleHueLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsHueLocked = !oldSettings.isHueLocked;
      localStorage.setItem('isHueLocked', newIsHueLocked.toString());
      return {
        palette,
        settings: oldSettings.buildNewFromIsHueLocked(newIsHueLocked)
      };
    });
  }

  const handleSwatchCopy = (location: ColorLocation) => {
    setState(({ settings: oldSettings, palette }) => {
      const newSettings = oldSettings.buildNewFromSaveToClipboard(location, palette);
      navigator.clipboard.writeText(newSettings.copied!.hex);
      return {
        palette,
        settings: newSettings
      };
    });
  }

  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    let color = settings.copied;
    if (clipboardText.trim() != '') {
      color = Color.build(clipboardText.trim());
    }
    if (settings.selectedLocation != null && color != null) {
      handleSelectedColorChange(ColorChangeType.all)(color);
    }
  }

  const handleToggleSaturationLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isSaturationLocked;
      localStorage.setItem('isSaturationLocked', newIsSVLocked.toString());
      return {
        palette,
        settings: oldSettings.buildNewFromIsSaturationLocked(newIsSVLocked)
      };
    });
  }

  const handleToggleValueLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isValueLocked;
      localStorage.setItem('isValueLocked', newIsSVLocked.toString());
      return {
        palette,
        settings: oldSettings.buildNewFromIsValueLocked(newIsSVLocked)
      };
    });
  }

  const handleToggleLightnessLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isLightnessLocked;
      localStorage.setItem('isLightnessLocked', newIsSVLocked.toString());
      return {
        palette,
        settings: oldSettings.buildNewFromIsLightnessLocked(newIsSVLocked)
      };
    });
  }

  const handleToggleIsBrightnessMode = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsBrightnessMode = !(oldSettings.displayAs === ColorDisplayType.Brightness);
      localStorage.setItem('isBrightnessMode', newIsBrightnessMode.toString());
      return {
        palette,
        settings: oldSettings.buildNewFromDisplayAs(newIsBrightnessMode ? ColorDisplayType.Brightness : ColorDisplayType.RGB)
      };
    });
  }

  const handleColorSelection = (location: ColorLocation) => {
    setState(({ settings: oldSettings, palette }) => ({ palette, settings: oldSettings.buildNewFromSelection(location, palette) }));
  }

  const handleColorDeselection = () => {
    setState(({ settings: oldSettings, palette }) => ({ palette, settings: oldSettings.buildNewFromDeselection() }));
  }

  const handleSelectedColorChange = (changeType: ColorChangeType) => (color: Color) => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromColor(color, changeType, oldSettings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      let newSettings = oldSettings.buildNewFromGlobalColor(color, changeType);
      if (newSettings.selectedLocation != null && newSettings.selectedLocation.equals(newSettings.copiedLocation)) {
        newSettings = newSettings.buildNewFromEmptyClipboard();
      }
      return {
        palette: newPalette,
        settings: newSettings
      };
    });
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

  React.useEffect(() => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      event.preventDefault();
      let charCode = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
        if (settings.selectedLocation != null) {
          handleSwatchCopy(settings.selectedLocation);
        }
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
        handlePaste();
      }
    }

    /* @ts-ignore */
    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      /* @ts-ignore */
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [settings]);

  const changeStubNumber = (stubNumber: number) => {
    // const newStubs = stubs.map((stub) => [
    //   ...stub.filter((_, index) => index < stubNumber),
    //   ...((stub.length < stubNumber) ? (Array(stubNumber - stub.length).fill(stub[stub.length - 1])) : [])
    // ]);
    // updateAllStubs(newStubs, isHorizontal, true, true);
  }

  const addStub = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromAddNewStub(oldSettings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromAddStub()
      };
    });
  }

  const removeStub = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromRemoveStub(oldSettings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromRemoveStub()
      };
    });
  }

  const addShade = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromAddNewShade(oldSettings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromAddShade()
      };
    });
  }

  const removeShade = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromRemoveShade(oldSettings);
      localStorage.setItem('stubs', JSON.stringify(newPalette.toHexCodes()));
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromRemoveShade()
      };
    });
  }

  const methods: UpdateMethods = {
    handleToggleDirection,
    handleToggleHueLock,
    handleSwatchCopy,
    handlePaste,
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
    addShade,
    removeShade,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
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
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
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
      </Drawer>
    </Box >
  );
}