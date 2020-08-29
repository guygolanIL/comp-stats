export abstract class AbstractResourceController<T>{

    private readonly _activeResources: T[];
    private readonly _maxActiveResources: number;

    constructor(maxActiveResources: number){
        this._maxActiveResources = maxActiveResources;
        this._activeResources = [];
    }

    protected abstract getNewObject(): T;
    protected abstract eraseObject(object: T): void;

    get activeResources(): T[] {
        return this._activeResources;
    } 

    get maxActiveResources(): number {
        return this._maxActiveResources;
    }


    public update(
        percentage: number,
        onDone: (objectInMemory: number) => void
    ): void {
        const percentToSet = percentage / 100; // transforming to 0-1 range
        const currentPercent = this.activeResources.length / this.maxActiveResources;

        const delta = percentToSet - currentPercent;

        let objectsToAddRemove = Math.ceil(Math.abs(delta * this.maxActiveResources));

        if (delta > 0) {
            // need to add objects
            console.log(`adding ${objectsToAddRemove} objects`);
            for (let i = 0; i < objectsToAddRemove; i++) {
                this.activeResources.push(this.getNewObject());
            }
            onDone(this.activeResources.length);
        } else {
            // need to subtract objects
            console.log(`removing ${objectsToAddRemove} objects`);

            for (let i = 0; i < this.activeResources.length; i++) {
                let element = this.activeResources.pop();
                this.eraseObject(element as T);
            }

            if(global.gc) {
                global.gc();
            }
            

            onDone(this.activeResources.length);
        }
    }

}