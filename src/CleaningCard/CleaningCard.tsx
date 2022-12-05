import React, { KeyboardEvent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalStorageList from '../LocalStorage';
import { red, orange, yellow, green, blue, purple, indigo, brown, pink, cyan } from '@mui/material/colors';
import TextField from '@mui/material/TextField';


export type CardInputs = {
    readonly title: string,
    readonly subtitle: string,
    readonly localStorageTasks: LocalStorageList,
    readonly schedule: CardSchedule,
}

export enum CardSchedule {
    Daily,
    Monthly,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

export default function CleaningCard({ localStorageTasks, title = '', subtitle = '', schedule = CardSchedule.Daily }: CardInputs) {
    const [lineItems, setLineItems] = React.useState(
        localStorageTasks.items
    );

    const handleToggle = (value: number) => () => {
        localStorageTasks.toggleItem(value);
        setLineItems(localStorageTasks.items);
    };

    const handleRemove = (value: number) => () => {
        localStorageTasks.removeItem(value);
        setLineItems(localStorageTasks.items);
    };

    const getFormattedNewText = (text: string) => {
        const trimmedText = text.trim();
        return trimmedText[0].toUpperCase() + trimmedText.slice(1).toLowerCase();
    }

    const handleAdd = () => {
        setTriedToAdd(true);
        if (!newItemTextIsValid) return;
        localStorageTasks.addItem(getFormattedNewText(newItemText));
        setLineItems(localStorageTasks.items);
        setNewItemText('');
        setTriedToAdd(false);
    };

    const typeNewText = (value: string) => {
        setNewItemText(value);
        setTriedToAdd(false);
        const formattedText = getFormattedNewText(value);
        setNewItemTextIsValid(formattedText !== '' && lineItems.every((lineItem) => lineItem.title !== formattedText));
    }

    const [newItemTextIsValid, setNewItemTextIsValid] = React.useState(false);

    const [newItemText, setNewItemText] = React.useState('');

    const [triedToAdd, setTriedToAdd] = React.useState(false);

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>
    ): void => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    }

    const getAvatarColor = (): string => {
        switch (schedule) {
            case CardSchedule.Daily:
                return cyan[800];
            case CardSchedule.Monthly:
                return brown[500];
            case CardSchedule.Monday:
                return red[500];
            case CardSchedule.Tuesday:
                return orange[500];
            case CardSchedule.Wednesday:
                return yellow[700];
            case CardSchedule.Thursday:
                return green[500];
            case CardSchedule.Friday:
                return blue[500];
            case CardSchedule.Saturday:
                return purple[500];
            default:
                return indigo[500];
        }
    };

    const getAvatarName = (): string => {
        switch (schedule) {
            case CardSchedule.Daily:
                return 'D';
            case CardSchedule.Monthly:
                return 'Mt';
            case CardSchedule.Monday:
                return 'M';
            case CardSchedule.Tuesday:
                return 'Tu';
            case CardSchedule.Wednesday:
                return 'W';
            case CardSchedule.Thursday:
                return 'Th';
            case CardSchedule.Friday:
                return 'F';
            case CardSchedule.Saturday:
                return 'Sa';
            default:
                return 'Su';
        }
    };

    return (
        <Card sx={{ width: 400, maxWidth: '100vw' }}>
            <CardHeader
                title={title}
                subheader={subtitle}
                avatar={
                    <Avatar sx={{ bgcolor: getAvatarColor() }} aria-label="recipe">
                        {getAvatarName()}
                    </Avatar>
                }
            />
            <CardContent>
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {lineItems.map((lineItem, index) => {
                        const labelId = `checkbox-list-secondary-label-${index}`;
                        return (
                            <ListItem
                                key={`${localStorageTasks.currentDateView}.${title}.${lineItem.title}`}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={handleRemove(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={lineItem.checked}
                                            tabIndex={-1}
                                            disableRipple
                                            sx={{
                                                color: (lineItem.wasThisDate || lineItem.isNew) ? pink[800] : null,
                                                '&.Mui-checked': {
                                                    color: (lineItem.wasThisDate || lineItem.isNew) ? pink[600] : null,
                                                },
                                            }}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={lineItem.title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="add to checklist" onClick={handleAdd}>
                                <AddIcon />
                            </IconButton>
                        }>
                        <TextField
                            error={triedToAdd && !newItemTextIsValid}
                            helperText={(triedToAdd && !newItemTextIsValid) ? "*This field is required and cannot be any previous tasks" : ""}
                            fullWidth
                            type="text"
                            label="Add new task"
                            variant="standard"
                            onChange={(event) => typeNewText(event.target.value)}
                            onKeyDown={handleKeyDown}
                            value={newItemText} />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
}