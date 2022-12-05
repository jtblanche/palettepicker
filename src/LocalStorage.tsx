import date from 'date-and-time';
import { CardSchedule } from './CleaningCard';

export type LineItem = {
    readonly title: string,
    readonly checked: boolean,
    readonly wasThisDate: boolean,
    readonly wasChecked: boolean,
    readonly isNew: boolean
}

export default class LocalStorageList {
    name: string;
    items: Array<LineItem> = [];
    storedDates: Array<string> = [];
    currentDateView: Date = new Date();
    defaultList: Array<string> = [];
    schedule: CardSchedule = CardSchedule.Daily;

    constructor(name: string, defaultList: Array<string> = [], schedule: CardSchedule) {
        this.name = name;
        this.defaultList = defaultList;
        this.schedule = schedule;
        this.moveDate(new Date());
    }

    moveDate(dateView: Date) {
        const viewStr = date.format(dateView, 'YYYY/MM/DD');
        const simplifiedDateView = date.parse(viewStr, 'YYYY/MM/DD');
        const storedDatesStr: string = localStorage.getItem(`${this.name}_storedDates`)?.trim() || '[]';
        this.storedDates = JSON.parse(storedDatesStr);
        this.storedDates.sort();

        const relevantDates = this.storedDates.filter((dateStr) => simplifiedDateView >= date.parse(dateStr, 'YYYY/MM/DD'));
        const lastDateStr = relevantDates[relevantDates.length - 1] ?? '';
        this.currentDateView = simplifiedDateView;
        const lastDate = date.parse(lastDateStr, 'YYYY/MM/DD');
        let thisMonday = simplifiedDateView;
        switch (date.format(simplifiedDateView, 'dddd')) {
            case 'Tuesday':
                thisMonday = date.addDays(simplifiedDateView, -1);
                break;
            case 'Wednesday':
                thisMonday = date.addDays(simplifiedDateView, -2);
                break;
            case 'Thursday':
                thisMonday = date.addDays(simplifiedDateView, -3);
                break;
            case 'Friday':
                thisMonday = date.addDays(simplifiedDateView, -4);
                break;
            case 'Saturday':
                thisMonday = date.addDays(simplifiedDateView, -5);
                break;
            case 'Sunday':
                thisMonday = date.addDays(simplifiedDateView, -6);
                break;
            default:
                thisMonday = simplifiedDateView;
                break;
        }
        if (lastDateStr === '') {
            this.items = this.defaultList.map<LineItem>(item => ({
                title: item,
                checked: false,
                wasThisDate: false,
                wasChecked: false,
                isNew: false,
            }));
            return;
        }
        if (viewStr !== lastDateStr) {
            const itemsStr: string = localStorage.getItem(`${lastDateStr}_${this.name}`)?.trim() || '[]';
            const prevItems: Array<LineItem> = JSON.parse(itemsStr);
            switch (this.schedule) {
                case CardSchedule.Daily:
                    this.items = prevItems.map(item => ({
                        title: item.title,
                        checked: false,
                        wasThisDate: false,
                        wasChecked: false,
                        isNew: false,
                    }));
                    break;
                case CardSchedule.Monthly:
                    if (date.format(simplifiedDateView, 'YYYY/MM') !== date.format(lastDate, 'YYYY/MM')) {
                        this.items = prevItems.map(item => ({
                            title: item.title,
                            checked: false,
                            wasThisDate: false,
                            wasChecked: false,
                            isNew: false,
                        }));
                    } else {
                        this.items = prevItems.map(item => ({
                            title: item.title,
                            checked: item.checked,
                            wasThisDate: false,
                            wasChecked: item.checked,
                            isNew: false,
                        }));
                    }
                    break;
                default:
                    if (lastDate < thisMonday) {
                        this.items = prevItems.map(item => ({
                            title: item.title,
                            checked: false,
                            wasThisDate: false,
                            wasChecked: false,
                            isNew: false,
                        }));
                    } else {
                        this.items = prevItems.map(item => ({
                            title: item.title,
                            checked: item.checked,
                            wasThisDate: false,
                            wasChecked: item.checked,
                            isNew: false,
                        }));
                    }
                    break;
            }
            return;
        }
        const itemsStr: string = localStorage.getItem(`${viewStr}_${this.name}`)?.trim() || '[]';
        this.items = JSON.parse(itemsStr);
    }

    getItems(updateDateStr: string): Array<LineItem> | null {
        if (this.storedDates.indexOf(updateDateStr) === -1) {
            return null;
        }
        return JSON.parse(localStorage.getItem(`${updateDateStr}_${this.name}`) ?? `[]`);
    }

    storeItems(updateDate: Date, lineItems: Array<LineItem>) {
        const updateDateStr = date.format(updateDate, 'YYYY/MM/DD');
        if (this.storedDates.indexOf(updateDateStr) === -1) {
            this.storedDates[this.storedDates.length] = updateDateStr;
            this.storedDates.sort();
            localStorage.setItem(`${this.name}_storedDates`, JSON.stringify(this.storedDates));
        }
        localStorage.setItem(`${updateDateStr}_${this.name}`, `${JSON.stringify(lineItems)}`);
    }

    addItem(item: string) {
        const newItemIndex = this.items.length;
        const newItem: LineItem = { title: item, checked: false, wasThisDate: false, wasChecked: false, isNew: true };
        this.items = [...this.items, newItem];
        this.storeItems(this.currentDateView, this.items);
        const relevantDates = this.storedDates.filter((dateStr) => this.currentDateView < date.parse(dateStr, 'YYYY/MM/DD'));
        relevantDates.every(dateStr => {
            let lineItems = this.getItems(dateStr);
            if (lineItems?.every(lineItem => lineItem.title !== item)) {
                let newLineItems = [...lineItems.slice(0, (lineItems.length >= newItemIndex) ? newItemIndex : lineItems.length), newItem];
                if (lineItems.length >= newItemIndex) {
                    lineItems = [...newLineItems, ...lineItems.slice(newItemIndex)];
                } else {
                    lineItems = newLineItems;
                }
                this.storeItems(date.parse(dateStr, 'YYYY/MM/DD'), lineItems);
                return true;
            } else {
                return false;
            }
        });
    }

    removeItem(value: number) {
        const prevLength = this.items.length;
        const deletedTitle = this.items[value].title;
        this.items = this.items.filter((_, index) => index !== value);
        if (prevLength === this.items.length) return;
        this.storeItems(this.currentDateView, this.items);
        const relevantDates = this.storedDates.filter((dateStr) => this.currentDateView < date.parse(dateStr, 'YYYY/MM/DD'));
        relevantDates.every(dateStr => {
            let lineItems = this.getItems(dateStr);
            if (lineItems?.every(lineItem => lineItem.title !== deletedTitle)) {
                return false;
            } else {
                lineItems = lineItems!.filter((lineItem) => lineItem.title !== deletedTitle);
                this.storeItems(date.parse(dateStr, 'YYYY/MM/DD'), lineItems);
                return true;
            }
        });
    }

    toggleItem(index: number) {
        const prevValue = this.items[index];
        const newItems = [...this.items];
        const newValue = !prevValue.checked;
        newItems[index] = {
            title: prevValue.title,
            checked: newValue,
            wasThisDate: (newValue !== prevValue.wasChecked),
            wasChecked: prevValue.wasChecked,
            isNew: prevValue.isNew,
        }
        this.items = newItems;
        this.storeItems(this.currentDateView, this.items);
        const relevantDates = this.storedDates.filter((dateStr) => this.currentDateView < date.parse(dateStr, 'YYYY/MM/DD'));
        relevantDates.every(dateStr => {
            let lineItems = this.getItems(dateStr);
            let indexOfItem = lineItems!.findIndex(lineItem => lineItem.title === prevValue.title);
            let nextItem = lineItems![indexOfItem];
            if (indexOfItem === -1 || nextItem.checked === newValue) {
                lineItems![indexOfItem] = {
                    title: nextItem.title,
                    checked: nextItem.checked,
                    wasThisDate: false,
                    wasChecked: nextItem.checked,
                    isNew: false,
                }
                this.storeItems(date.parse(dateStr, 'YYYY/MM/DD'), lineItems!);
                return false;
            } else {
                lineItems![indexOfItem] = {
                    title: nextItem.title,
                    checked: newValue,
                    wasThisDate: false,
                    wasChecked: newValue,
                    isNew: false
                }
                this.storeItems(date.parse(dateStr, 'YYYY/MM/DD'), lineItems!);
                return true
            }
        });
    }
}