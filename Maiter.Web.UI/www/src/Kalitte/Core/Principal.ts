import { $rootScope } from '../Vendor/AngularService';
import {Kalitte} from '../Data/Models';

export enum PrincipalType {
    Anonymous = 0,
    User = 1,
}

export interface IPrincipal {
    identity: Kalitte.Identity;
    isAuthenticated: boolean;
    IsInRole: (string) => boolean;
    userData: any;
}

export class Principal<T extends Kalitte.Identity> implements IPrincipal {

    public identity: T;
    private roles = new Array<string>();

    constructor(identity: T, public isAuthenticated: boolean, roles: Array<string>, public userData: any = undefined) {
        this.identity = angular.copy(identity);
        roles.forEach((role) => {
            this.roles.push(role);
        });
    }

    IsInRole(role: string) {
        return this.roles.indexOf(role) >= 0;
    }
}

export class AnonymousPrincipal extends Principal<Kalitte.Identity> {
    constructor() {
        super({ Title: '', UserName: '' , UserId : '' }, false, []);
    }
}

export class UserPrincipal extends Principal<Kalitte.Identity> {
    constructor(identity: Kalitte.Identity, roles: Array<string>, userData) {
        super(identity, true, roles, userData);
    }
}