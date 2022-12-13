

interface ProcessorInputs<T> {
    uniqueName: string;
    getDefault: () => T;
    saveToString: (input: T) => string;
    deriveFromString: (input: string) => T | null;
}

export default class LocalStorageProcessor<T> {
    inputs: ProcessorInputs<T>;

    private static get globalPrefix(): string {
        return '_#$%';
    }

    private static get globalKeyNamePrefix(): string {
        return '_!!!key'
    }

    private get lastKeyKey(): string {
        return `${LocalStorageProcessor.globalKeyNamePrefix}${this.inputs.uniqueName}`;
    }

    private get keysKey(): string {
        return `${LocalStorageProcessor.globalKeyNamePrefix}s${this.inputs.uniqueName}`;
    }

    private get key(): string {
        return `${LocalStorageProcessor.globalPrefix}${this.inputs.uniqueName}`;
    }

    private static get unsavedPostKey(): string {
        return '(Unsaved)';
    }

    private loadLastFullKey(): string | null {
        return localStorage.getItem(this.lastKeyKey);
    }

    public loadLastKey(): string | null {
        return localStorage.getItem(this.lastKeyKey)?.split(LocalStorageProcessor.unsavedPostKey).join('') ?? null;
    }

    private saveKeys(keys: Array<string>) {
        const sortedKeys = keys.sort();
        localStorage.setItem(this.keysKey, sortedKeys.join(','));
    }

    public loadKeys(): Array<string> {
        return (localStorage.getItem(this.keysKey)?.split(','))?.filter((key) => key != '') ?? [];
    }

    public remove(extraKey: string = '') {
        let postStr = '';
        if (extraKey != '') {
            postStr = `.${extraKey}`;
            let keys = this.loadKeys();
            keys = keys.filter((key) => key !== extraKey);
            this.saveKeys(keys);
        }
        localStorage.removeItem(
            `${this.key}${postStr}`
        );
    }

    public preSave(value: T, extraKey: string) {
        const unsavedExtraKey = `${extraKey} ${LocalStorageProcessor.unsavedPostKey}`;
        const postStr = `.${unsavedExtraKey}`;
        const keys = this.loadKeys();
        if (!keys.includes(unsavedExtraKey)) {
            keys[keys.length] = unsavedExtraKey;
            this.saveKeys(keys);
        }
        localStorage.setItem(this.lastKeyKey, extraKey);
        localStorage.setItem(
            `${this.key}${postStr}`,
            this.inputs.saveToString(value)
        );
    }

    public save(value: T, extraKey: string = '') {
        let postStr = '';
        if (extraKey != '') {
            postStr = `.${extraKey}`;
            const keys = this.loadKeys();
            if (!keys.includes(extraKey)) {
                keys[keys.length] = extraKey;
                this.saveKeys(keys);
            }
            const unsavedExtraKey = `${extraKey} ${LocalStorageProcessor.unsavedPostKey}`;
            if (keys.includes(unsavedExtraKey)) {
                this.remove(unsavedExtraKey);
            }
            if (postStr != '') {
                localStorage.setItem(this.lastKeyKey, extraKey);
            }
        }
        localStorage.setItem(
            `${this.key}${postStr}`,
            this.inputs.saveToString(value)
        );
    }

    public load(extraKey: string = ''): T {
        let postStr = '';
        const loadedExtraKey = extraKey == '' ? (this.loadLastFullKey() ?? '') : extraKey;
        if (loadedExtraKey != '') {
            postStr = `.${loadedExtraKey}`;
            const keys = this.loadKeys();
            if (!keys.includes(loadedExtraKey)) {
                postStr = '';
            }
            if (postStr !== '') {
                const unsavedExtraKey = `${extraKey} ${LocalStorageProcessor.unsavedPostKey}`;
                if (keys.includes(unsavedExtraKey)) {
                    this.remove(unsavedExtraKey);
                }
            }
        }
        return this.inputs.deriveFromString(localStorage.getItem(`${this.key}${postStr}`) ?? 'null') ?? this.inputs.getDefault();
    }

    constructor(inputs: ProcessorInputs<T>) {
        this.inputs = inputs;
    }
}