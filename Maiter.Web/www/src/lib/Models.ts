export module Security {
	export module Constants {
		export var WaiterRole: string = "waiter";
		export var ManagerRole: string = "manager";
		export var ValeRole: string = "vale";
		export var AdminRole: string = "admin";
		export var CustomerRole: string = "customer";
	}
}
export module Entity {
}
export module Data {
}

export module Security {
	export interface Constants {
	}
	export interface Credential {
		ID: string;
		Password: string;
	}
	export interface Identity {
		ID: string;
		Title: string;
	}
	export interface LoginResult<T> {
		Identity: T;
		Roles: string[];
	}
}
export module Entity {
	export interface City extends Entity.EntityBase {
		Name: string;
		Country: Entity.Country;
	}
	export interface EntityBase {
		Id: string;
	}
	export interface Country extends Entity.EntityBase {
		Name: string;
	}
	export interface Company extends Entity.EntityBase {
		Name: string;
		Location: Data.GeoPoint;
	}
}
export module Data {
	export interface GeoPoint {
		Lat: number;
		Long: number;
	}
	export interface CreatedResponse {
		Id: string;
	}
}
