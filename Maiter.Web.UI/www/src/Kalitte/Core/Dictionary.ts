

export interface IKeyValue<K, V> {
    Key: K;
    Value: V;
}

export class KeyValue<K,V> implements IKeyValue<K, V> {
    constructor(public Key: K, public Value: V) {
    }
}


export class Dictionary<K, V> {
    public Items = {};

    Add(key: any, value: V) {
        this.Items[key] = value;
    }

    Remove(key: any) {
        delete this.Items[key];
    }

    Get(key: any): V {
        return this.Items[key];
    }

    GetItems(): Array<KeyValue<K, V>> {
        var result = new Array<KeyValue<K, V>>();

        for (var key in this.Items)
            result.push(new KeyValue<K, V>(key, this.Items[key]));

        return result;
    }

}