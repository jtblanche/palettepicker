

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

    private static get globalUnsavedPrefix(): string {
        return '__unsaved!';
    }

    private static get globalUnsavedIndexPrefix(): string {
        return '__unsavedind!';
    }

    private static get globalKeyNamePrefix(): string {
        return '_!!!key'
    }

    private get unsavedKey(): string {
        return `${LocalStorageProcessor.globalUnsavedPrefix}${this.inputs.uniqueName}`;
    }

    private get unsavedIndexKey(): string {
        return `${LocalStorageProcessor.globalUnsavedIndexPrefix}${this.inputs.uniqueName}`;
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

    private loadLastFullKey(): string | null {
        return localStorage.getItem(this.lastKeyKey);
    }

    public loadLastKey(): string | null {
        return localStorage.getItem(this.lastKeyKey) ?? null;
    }

    private saveKeys(keys: Array<string>) {
        const sortedKeys = keys.sort();
        localStorage.setItem(this.keysKey, sortedKeys.join(','));
    }

    public loadKeys(): Array<string> {
        return (localStorage.getItem(this.keysKey)?.split(','))?.filter((key) => key != '') ?? [];
    }

    public getUnsavedIndex(): number {
        return JSON.parse(localStorage.getItem(this.unsavedIndexKey) ?? '0');
    }

    public setUnsavedIndex(index: number) {
        localStorage.setItem(this.unsavedIndexKey, index.toString());
    }

    public remove(extraKey: string = '', onlyPresave: boolean = false) {
        let postStr = '';
        if (extraKey != '') {
            postStr = `.${extraKey}`;
            if (!onlyPresave) {
                let keys = this.loadKeys();
                keys = keys.filter((key) => key !== extraKey);
                this.saveKeys(keys);
            }
        }
        if (!onlyPresave) {
            localStorage.removeItem(
                `${this.key}${postStr}`
            );
        }
        localStorage.removeItem(`${this.unsavedKey}${postStr}`);
    }

    public preSave(value: T, extraKey: string) {
        let postStr = `.${extraKey}`;
        const keys = this.loadKeys();
        if (!keys.includes(extraKey)) {
            keys[keys.length] = extraKey;
            this.saveKeys(keys);
            this.save(value, extraKey);
        }
        let changes = this.loadUnsaved(extraKey);
        const currentIndex = this.getUnsavedIndex();
        changes = [value, ...changes.filter((_, index) => index < (10 + currentIndex) && index >= currentIndex)];
        this.setUnsavedIndex(0);
        localStorage.setItem(`${this.unsavedKey}${postStr}`, JSON.stringify(changes.map((change) => this.inputs.saveToString(change))));
    }

    public undo(extraKey: string): T {
        let changes = this.loadUnsaved(extraKey);
        let newIndex = this.getUnsavedIndex() + 1;
        if (newIndex >= changes.length) {
            newIndex = changes.length - 1;
        }
        this.setUnsavedIndex(newIndex);
        return changes[newIndex] ?? this.inputs.deriveFromString(localStorage.getItem(`${this.key}.${extraKey}`) ?? 'null') ?? this.inputs.getDefault();;
    }

    public redo(extraKey: string): T {
        let changes = this.loadUnsaved(extraKey);
        let newIndex = this.getUnsavedIndex() - 1;
        if (newIndex < 0) {
            newIndex = 0;
        }
        this.setUnsavedIndex(newIndex);
        return changes[newIndex] ?? this.inputs.deriveFromString(localStorage.getItem(`${this.key}.${extraKey}`) ?? 'null') ?? this.inputs.getDefault();;
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
            this.remove(extraKey, true);
            this.setUnsavedIndex(0);
            if (postStr != '') {
                localStorage.setItem(this.lastKeyKey, extraKey);
            }
        }
        localStorage.setItem(
            `${this.key}${postStr}`,
            this.inputs.saveToString(value)
        );
    }

    public loadUnsaved(extraKey: string): Array<T> {
        let postStr = '';
        const loadedExtraKey = extraKey == '' ? (this.loadLastFullKey() ?? '') : extraKey;
        if (loadedExtraKey != '') {
            postStr = `.${loadedExtraKey}`;
            const keys = this.loadKeys();
            if (!keys.includes(loadedExtraKey)) {
                postStr = '';
            }
        }
        return JSON.parse(localStorage.getItem(`${this.unsavedKey}${postStr}`) ?? '[]').map((changeStr: string) => this.inputs.deriveFromString(changeStr)) ?? [this.inputs.getDefault()];
    }

    public load(extraKey: string = ''): T {
        let postStr = '';
        const lastLoaded = this.loadLastFullKey() ?? '';
        const loadedExtraKey = extraKey == '' ? (lastLoaded ?? '') : extraKey;
        if (loadedExtraKey != '') {
            postStr = `.${loadedExtraKey}`;
            const keys = this.loadKeys();
            if (!keys.includes(loadedExtraKey)) {
                postStr = '';
            }
        }
        if (lastLoaded != loadedExtraKey) {
            this.remove(lastLoaded, true);
            this.setUnsavedIndex(0);
        }
        const currentIndex = this.getUnsavedIndex();
        return this.loadUnsaved(extraKey)[currentIndex] ?? this.inputs.deriveFromString(localStorage.getItem(`${this.key}${postStr}`) ?? 'null') ?? this.inputs.getDefault();
    }

    constructor(inputs: ProcessorInputs<T>) {
        this.inputs = inputs;
    }
}