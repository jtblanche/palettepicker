import * as React from 'react';
import date from 'date-and-time';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CleaningCard, { CardInputs, CardSchedule } from './CleaningCard';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LocalStorageList from './LocalStorage';
import MenuIcon from '@mui/icons-material/Menu';
import PaletteIcon from '@mui/icons-material/Palette';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function RecipeReviewCard() {

  const [open, setOpen] = React.useState(false)
  const [isEditingStubNumber, setIsEditingStubNumber] = React.useState(false)

  const [isHorizontal, setIsHorizontal] = React.useState((localStorage.getItem('isHorizontal') ?? 'false') === 'true')

  const [stubNumber, setStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '5'));

  const [nextStubNumber, setNextStubNumber] = React.useState(JSON.parse(localStorage.getItem('stubNumber') ?? '5'));

  const onUpdateStubNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.validity', e.target.validity.valid);
    if (e.target.validity.valid || e.target.value === '') setNextStubNumber(e.target.value)
  }

  const handleToggleDirection = () => {
    const newIsHorizontal = !isHorizontal;
    setIsHorizontal(newIsHorizontal);
    localStorage.setItem('isHorizontal', newIsHorizontal.toString())
    setSelectedColumn(null);
    setSelectedRow(null);
  }

  const handleToggleEditStubNumber = () => {
    const newIsEditingStubNumber = !isEditingStubNumber;
    setIsEditingStubNumber(newIsEditingStubNumber);
    if (!newIsEditingStubNumber) {
      if (nextStubNumber <= 10 && nextStubNumber >= 1) {
        setStubNumber(nextStubNumber);
        localStorage.setItem('stubNumber', nextStubNumber);
      } else {
        setNextStubNumber(stubNumber);
      }
    }
  }

  const getStubs = (): Array<Array<string>> => {
    const newStubs: Array<Array<string>> = [];
    if (isHorizontal) {
      for (let x = 0; x < colorStubs.length; x++) {
        const newStub: Array<string> = [];
        newStubs[x] = newStub;
        const stub = colorStubs[x];
        for (let y = 0; y < stub.length; y++) {
          const color = stub[y];
          newStubs[x][y] = color;
        }
      }
    } else {
      for (let x = 0; x < colorStubs.length; x++) {
        const stub = colorStubs[x];
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

  const colorStubs: Array<Array<string>> = [
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

  let orderedStubs = getStubs();

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null)
  const [selectedColumn, setSelectedColumn] = React.useState<number | null>(null)

  let getGridTemplateColumns = (): string => {
    return orderedStubs[0].map((_, index) => (index == selectedColumn) ? '4fr' : '1fr').join(' ');
  }

  let getGridTemplateRows = (): string => {
    return orderedStubs.map((_, index) => (index == selectedRow) ? '4fr' : '1fr').join(' ');
  }

  let setSelectedRowAndColumn = (x: number | null, y: number | null) => () => {
    if (selectedColumn == x && selectedRow == y) {
      setSelectedColumn(null);
      setSelectedRow(null);
      return;
    }
    setSelectedColumn(x);
    setSelectedRow(y);
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
              aria-label="today"
              onClick={console.log}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={console.log}
              color="inherit"
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={console.log}
              color="inherit"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
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
                onClick={setSelectedRowAndColumn(x, y)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexGrow: 1,
                  backgroundColor: color
                }}>
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