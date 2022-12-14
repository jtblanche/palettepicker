import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ColorPalette from '../ColorPalette';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Color, { ColorDisplayType } from '../Color';
import Palette, { ColorChangeType, paletteProcessor } from '../Palette';
import ColorLocation from '../ColorLocation';
import PaletteIcon from '@mui/icons-material/Palette';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { saveAs } from 'file-saver';
import Settings, { UpdateMethods, buildSettingsProcessor } from '../Settings';

import './App.scss';

interface AppState {
  settings: Settings,
  palette: Palette
}

export default function App() {
  const [open, setOpen] = React.useState(false);

  const _initialPalette = paletteProcessor.load();

  const _settingsProcessor = buildSettingsProcessor(
    new ColorLocation(
      _initialPalette.stubs.length - 1,
      _initialPalette.stubs[0].swatches.length - 1
    )
  );

  const _initialSettings = _settingsProcessor.load();

  const [{ settings, palette }, setState] = React.useState<AppState>({
    palette: _initialPalette, settings: _initialSettings
  });

  const [isEditingSaveName, setIsEditingSaveName] = React.useState(false);

  const [saveName, setSaveName] = React.useState(paletteProcessor.loadLastKey() ?? 'New Palette');

  const [currentSaveName, setCurrentSaveName] = React.useState(saveName);

  const [isEditingNextSaveName, setIsEditingNextSaveName] = React.useState(false);

  const [nextSaveName, setNextSaveName] = React.useState(`${saveName} 2`);


  const handleToggleEditNextSaveName = () => {
    const newIsEditingNextSaveName = !isEditingNextSaveName;
    setIsEditingNextSaveName(newIsEditingNextSaveName);
    if (!newIsEditingNextSaveName) {
      if (nextSaveName.trim() !== '') {
        setSaveName(nextSaveName);
        paletteProcessor.save(palette, nextSaveName)
        setPaletteNames(paletteProcessor.loadKeys());
      } else {
        setNextSaveName(`${saveName} 2`);
      }
    }
  }


  const handleToggleEditSaveName = () => {
    const newIsEditingSaveName = !isEditingSaveName;
    setIsEditingSaveName(newIsEditingSaveName);
    if (!newIsEditingSaveName) {
      if (currentSaveName.trim() !== '') {
        setSaveName(currentSaveName);
        paletteProcessor.save(palette, currentSaveName)
        setPaletteNames(paletteProcessor.loadKeys());
      } else {
        setCurrentSaveName(saveName);
      }
    }
  }

  const removePalette = (name: string) => {
    paletteProcessor.remove(name);
    setPaletteNames(paletteProcessor.loadKeys());
  }

  const loadPalette = (name: string) => {
    setState(({ settings, palette: _ }) => ({
      settings,
      palette: paletteProcessor.load(name)
    }));
    setSaveName(name);
  }

  const [paletteNames, setPaletteNames] = React.useState(paletteProcessor.loadKeys());

  const onUpdateNextSaveName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNextSaveName(e.target.value)
  }

  const onUpdateSaveName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSaveName(e.target.value)
  }

  const handleToggleDirection = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsHorizontal = !oldSettings.isHorizontal;
      const newSettings = oldSettings.buildNewFromIsHorizontal(newIsHorizontal);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings,
      }
    });
  }

  const handleToggleHueLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsHueLocked = !oldSettings.isHueLocked;
      const newSettings = oldSettings.buildNewFromIsHueLocked(newIsHueLocked);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings,
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

  const handleSave = async () => {
    paletteProcessor.save(palette, saveName);
    setPaletteNames(paletteProcessor.loadKeys());
  }

  const handleUndo = async () => {
    setState(({ settings: oldSettings, palette: _ }) => {
      const newPalette = paletteProcessor.undo(saveName);
      const newSettings = oldSettings.buildNewFromBottomRightLocation(new ColorLocation(
        newPalette.stubs.length - 1,
        newPalette.stubs[0].swatches.length - 1,
      ));
      return {
        settings: newSettings,
        palette: newPalette,
      }
    });
  }

  const handleRedo = async () => {
    setState(({ settings: oldSettings, palette: _ }) => {
      const newPalette = paletteProcessor.redo(saveName);
      const newSettings = oldSettings.buildNewFromBottomRightLocation(new ColorLocation(
        newPalette.stubs.length - 1,
        newPalette.stubs[0].swatches.length - 1,
      ));
      return {
        settings: newSettings,
        palette: newPalette,
      }
    });
  }

  const handleToggleSaturationLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isSaturationLocked;
      const newSettings = oldSettings.buildNewFromIsSaturationLocked(newIsSVLocked);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings,
      };
    });
  }

  const handleToggleValueLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isValueLocked;
      const newSettings = oldSettings.buildNewFromIsValueLocked(newIsSVLocked);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings,
      };
    });
  }

  const handleToggleLightnessLock = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsSVLocked = !oldSettings.isLightnessLocked;
      const newSettings = oldSettings.buildNewFromIsLightnessLocked(newIsSVLocked);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings
      };
    });
  }

  const handleToggleIsBrightnessMode = () => {
    setState(({ settings: oldSettings, palette }) => {
      const newIsBrightnessMode = !(oldSettings.displayAs === ColorDisplayType.Brightness);
      const newSettings = oldSettings.buildNewFromDisplayAs(newIsBrightnessMode ? ColorDisplayType.Brightness : ColorDisplayType.RGB);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings
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
      paletteProcessor.preSave(newPalette, saveName);
      setPaletteNames(paletteProcessor.loadKeys());
      let newSettings: Settings = oldSettings.buildNewFromGlobalColor(color, changeType);
      if (newSettings.selectedLocation != null && newSettings.selectedLocation.equals(newSettings.copiedLocation)) {
        newSettings = newSettings.buildNewFromEmptyClipboard();
      }
      return {
        palette: newPalette,
        settings: newSettings
      };
    });
  }

  const handleUpdateDisplayAsType = (event: SelectChangeEvent) => {
    const type = parseInt(event.target.value) as ColorDisplayType;
    setState(({ settings: oldSettings, palette }) => {
      const newSettings = oldSettings.buildNewFromDisplayAs(type);
      _settingsProcessor.save(newSettings);
      return {
        palette,
        settings: newSettings,
      }
    })
  };

  React.useEffect(() => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      let charCode = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
        if (settings.selectedLocation != null) {
          event.preventDefault();
          handleSwatchCopy(settings.selectedLocation);
        }
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
        event.preventDefault();
        handlePaste();
      } else if ((event.ctrlKey || event.metaKey) && charCode === 's') {
        event.preventDefault();
        handleSave();
      } else if ((event.ctrlKey || event.metaKey) && (event.shiftKey) && charCode === 'z') {
        event.preventDefault();
        handleRedo();
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'z') {
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'y') {
        handleRedo();
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

  const addStub = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromAddNewStub(oldSettings);
      paletteProcessor.preSave(newPalette, saveName);
      setPaletteNames(paletteProcessor.loadKeys());
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromAddStub()
      };
    });
  }

  const removeStub = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromRemoveStub(oldSettings);
      paletteProcessor.preSave(newPalette, saveName);
      setPaletteNames(paletteProcessor.loadKeys());
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromRemoveStub()
      };
    });
  }

  const addShade = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromAddNewShade(oldSettings);
      paletteProcessor.preSave(newPalette, saveName);
      setPaletteNames(paletteProcessor.loadKeys());
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromAddShade()
      };
    });
  }

  const removeShade = () => {
    setState(({ settings: oldSettings, palette: oldPalette }) => {
      const newPalette = oldPalette.buildNewFromRemoveShade(oldSettings);
      paletteProcessor.preSave(newPalette, saveName);
      setPaletteNames(paletteProcessor.loadKeys());
      return {
        palette: newPalette,
        settings: oldSettings.buildNewFromRemoveShade()
      };
    });
  }

  const saveToFile = () => {
    if (settings.displayAs === ColorDisplayType.GIMP) {
      return saveToGPL();
    }
    return saveToCSV();
  }

  const saveToGPL = () => {
    const header = `GIMP Palette\nName: ${saveName}\nColumns: ${palette.stubs.length}\n#\n`;
    let index = 0;
    const body = palette.stubs.map((stub) => stub.swatches.map((swatch) => `${swatch.color.gimpString}\tIndex ${index++}`).join('\n')).join('\n');
    const gplString = `${header}${body}`;
    const blob = new Blob([gplString], {
      type: "text/x-gimp-gpl;charset=utf-8"
    });
    saveAs(blob, `${saveName}.gpl`);
  }

  const saveToCSV = () => {
    let csv: Array<Array<string>> = [[]];
    palette.stubs.forEach((stub, stubIndex) => {
      if (settings.isHorizontal) {
        if (csv[stubIndex] == null) {
          csv[stubIndex] = []
        }
        csv[stubIndex][0] = `Stub ${stubIndex + 1}`
      } else {
        if (csv[0] == null) {
          csv[0] = []
        }
        csv[0][stubIndex] = `Stub ${stubIndex + 1}`
      }
      stub.swatches.forEach((swatch, swatchIndex) => {
        if (settings.isHorizontal) {
          if (csv[stubIndex] == null) {
            csv[stubIndex] = []
          }
          csv[stubIndex][swatchIndex + 1] = `"${swatch.color.toString(settings)}"`;
        } else {
          if (csv[swatchIndex + 1] == null) {
            csv[swatchIndex + 1] = []
          }
          csv[swatchIndex + 1][stubIndex] = `"${swatch.color.toString(settings)}"`;
        }
      });
    });
    const csvString = csv.map((csvStub) => csvStub.join(',')).join('\n');
    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8"
    });
    saveAs(blob, `${saveName}.csv`);
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
    handleToggleEditSaveName,
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
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {!isEditingSaveName && (
              <React.Fragment>
                <IconButton color="inherit" aria-label="Update Palette Name" onClick={handleToggleEditSaveName} sx={{ marginRight: 3 }}>
                  <EditIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', marginTop: '3px' }} onClick={handleToggleEditSaveName}>
                  {saveName}
                </Typography>
              </React.Fragment>
            )}
            {isEditingSaveName &&
              <React.Fragment>
                <IconButton color="inherit" aria-label="Update Palette Name" onClick={handleToggleEditSaveName} sx={{ marginRight: 3 }}>
                  <SaveIcon />
                </IconButton>
                <Typography color="inherit" variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex' }}>
                  <TextField
                    color="secondary"
                    label="Set current palette name"
                    variant="standard"
                    onChange={onUpdateSaveName}
                    value={currentSaveName}
                  />
                </Typography>
              </React.Fragment>
            }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton size="small" color="inherit" onClick={() => handleSave()}>
              <SaveIcon />
            </IconButton>
            <IconButton size="small" color="inherit" onClick={() => saveToFile()}>
              <FileDownloadIcon />
            </IconButton>
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
            <ListItem>
              <FormControl fullWidth>
                <InputLabel id="display-as">Show</InputLabel>
                <Select
                  labelId="display-as"
                  id="display-as-select"
                  value={settings.displayAs.toString()}
                  label="Show color value as"
                  onChange={handleUpdateDisplayAsType}
                >
                  <MenuItem value={ColorDisplayType.Unity.toString()}>Unity</MenuItem>
                  <MenuItem value={ColorDisplayType.GIMP.toString()}>GIMP Palette</MenuItem>
                  <MenuItem value={ColorDisplayType.Hex.toString()}>Hex values</MenuItem>
                  <MenuItem value={ColorDisplayType.RGB.toString()}>RGB</MenuItem>
                  <MenuItem value={ColorDisplayType.PRGB.toString()}>Percentage RGB</MenuItem>
                  <MenuItem value={ColorDisplayType.HSL.toString()}>HSL</MenuItem>
                  <MenuItem value={ColorDisplayType.HSV.toString()}>HSV</MenuItem>
                  <MenuItem value={ColorDisplayType.Brightness.toString()}>Estimated Brightness</MenuItem>
                </Select>
              </FormControl>
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
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="Update Palette Name" onClick={handleToggleEditNextSaveName}>
                  {!isEditingNextSaveName &&
                    <EditIcon />
                  }
                  {isEditingNextSaveName &&
                    <SaveIcon />
                  }
                </IconButton>
              }>
              {!isEditingNextSaveName &&
                <ListItemButton role={undefined} onClick={handleToggleEditNextSaveName} dense>
                  <ListItemText primary={'Update Palette Name'} />
                </ListItemButton>
              }
              {isEditingNextSaveName &&
                <TextField
                  fullWidth
                  label="Set current palette name"
                  variant="standard"
                  onChange={onUpdateNextSaveName}
                  value={nextSaveName}

                />
              }
            </ListItem>
            {paletteNames.map(paletteName => (
              <ListItem secondaryAction={
                <IconButton size="small" color="inherit" onClick={() => removePalette(paletteName)}>
                  <DeleteIcon />
                </IconButton>
              } key={paletteName}>
                <ListItemButton onClick={() => loadPalette(paletteName)}>
                  <ListItemText primary={paletteName == saveName ? `${paletteName} **` : paletteName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box >
  );
}