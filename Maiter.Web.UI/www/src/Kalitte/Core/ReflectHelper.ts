/// <reference path="../../ref/reflect-metadata/reflect-metadata.d.ts" />


export class ReflectHelper {
    static getMeta<T>(key: string, obj: any):T {
        return Reflect.getMetadata(key, obj);
    }

    static getOwnMeta<T>(key: string, obj: any): T {
        return Reflect.getOwnMetadata(key, obj);
    }
}