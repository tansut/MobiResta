

export interface IKeyValue<K, V> {
    Key: K;
    Value: V;
}

export class KeyValue<K,V> implements IKeyValue<K, V> {
    constructor(public Key: K, public Value: V) {
    }
}


export class Dictionary<K, V> {
    private items = {};

    Add(key: any, value: V) {
        this.items[key] = value;
    }

    Remove(key: any) {
        delete this.items[key];
    }

    Get(key: any) {
        return this.items[key];
    }

    GetItems(): Array<KeyValue<K, V>> {
        var result = new Array<KeyValue<K, V>>();

        for (var key in this.items)
            result.push(new KeyValue<K, V>(key, this.items[key]));

        return result;
    }

}