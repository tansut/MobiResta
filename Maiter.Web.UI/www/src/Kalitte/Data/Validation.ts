// <reference path="../../ref/reflect-metadata/reflect-metadata.d.ts" />

export class Validation {
    static Entity(value: string) {
        return (target: Object) => {
            //Reflect.defineMetadata("Entity", value, target);
        }
    }


    static Required() {
        return (target: Object) => {
            //Reflect.defineMetadata("Entity", value, target);
        }
    }


    static Log() {
        return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            var originalMethod = descriptor.value; // save a reference to the original method

            descriptor.value = function (...args: any[]) {
                console.log("The method args are: " + JSON.stringify(args)); // pre
                var result = originalMethod.apply(this, args);               // run and store the result
                console.log("The return value is: " + result);               // post
                return result;                                               // return the result of the original method
            };

            return descriptor;
        }
    }
}

export class EntityBase {
    constructor() {
        //let value: string = Reflect.getMetadata("Entity", this.constructor);
        
        //console.log(value);
    }
}

@Validation.Entity("Maiter.Shared")
export class Company extends EntityBase {

    @Validation.Required()
    public name: string;

    @Validation.Log()
    Foo(value) {
        return value + ' ' + 'Executed';
    }
}


var c1 = new Company(); var c2 = new Company();

c1.Foo('Volkan');
c2.Foo('Tansu');
