import {Security} from '../lib/Models';

export enum PrincipalType {
    Anonymous = 0,
    Customer = 1,
    ServiceUser = 2
}

export interface IPrincipal {
    identity: Security.Identity;
	isAuthenticated: boolean;
	IsInRole: (string) => boolean;
    type: PrincipalType;
}

export class Principal<T extends Security.Identity> implements IPrincipal {
	
	public identity:T;	
	private roles = new Array<string>();
	
    constructor(identity: T, public isAuthenticated: boolean, roles: Array<string>, public type: PrincipalType) {
		this.identity = angular.copy(identity);		
		roles.forEach((role)=> {
			this.roles.push(role);
		});
	}
	
	IsInRole(role: string) {
		return this.roles.indexOf(role) >= 0;
	}
}

//export class ServiceUserPrincipal extends Principal<Security.ServiceUserIdentity> {	
//    constructor(identity: Security.ServiceUserIdentity, roles: Array<string>) {
//        super(identity, true, roles, PrincipalType.ServiceUser)
//	}
//}

export class AnonymousPrincipal extends Principal<Security.Identity> {
    constructor() {
        super({ ID: '', Title: '' }, false, [], PrincipalType.Anonymous);
	}
}

export class UserPrincipal extends Principal<Security.Identity> {	
    constructor(identity: Security.Identity, roles: Array<string>) {
        super(identity, true, roles, PrincipalType.Customer)
	}
}