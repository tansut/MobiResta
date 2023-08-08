export class List<T> {
    public Items: Array<T>;

    constructor() {
        this.Items = new Array<T>();
    }

    public Add(item: T): T {
        this.Items.push(item);
        return item;
    }

    public Clear() {
        this.Items.length = 0;
    }
}