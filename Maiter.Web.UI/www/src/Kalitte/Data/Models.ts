export module Kalitte {
    export enum RegistrationErrors {
        UserExists = 0,
        ValidationError = 1,
        UnknwownError = 2
    }
    export enum KnownException {
        EntityValidation = 0,
        Unauthorized = 1,
        KnownSecurityException = 2,
        NoResource = 3,
        TechnicalException = 4,
        BusinessException = 5
    }
    export interface EntityBase {
        Id: string;
    }
    export interface ExternalLoginViewModel {
        Name: string;
        Url: string;
        State: string;
    }
    export interface RegisterExternalBindingModel {
        UserName: string;
        Provider: string;
        ExternalAccessToken: string;
        Name: string;
        Surname: string;
        ClientId: string;
    }
    export interface FacebookAuthUserInfoResult {
        Email: string;
        FacebookId: string;
        Name: string;
        Surname: string;
        ExternalKey: string;
        ProvierKey: string;
        Gender: string;
        FacebookPage: string;
        Locale: string;
        Timezone: string;
    }
    export interface RegisterModel {
        Name: string;
        Surname: string;
        Email: string;
        Password: string;
        PasswordRepeat: string;
    }
    export interface Credential {
        ID: string;
        Password: string;
        UseRefreshTokens: boolean;
    }
    export interface Identity {
        UserName: string;
        Title: string;
        UserId: string;
    }
    export interface LocalAccessTokenResponse {
        UserName: string;
        Id: string;
        AccessToken: string;
        ExpiresIn: number;
        Issued: string;
        Expires: string;
        TokenType: string;
        Refresh_Token: string;
    }
    export interface LoginResult<T> {
        Identity: T;
        Roles: string[];
        UserData: any;
    }
    export interface RegisterResult<T> extends Kalitte.LoginResult<T> {
    }
    export interface AjaxExceptionResult {
        Message: string;
        ErrorCode: number;
        CodeIdentifier: string;
        ExceptionMessage: string;
        StackTrace: string;
        KnownException: Kalitte.KnownException;
        ExtraData: any;
    }
    export interface CodedOperationResult<T, TError> extends Kalitte.SimpleOperationResult<T> {
        ErrorCode: TError;
    }
    export interface SimpleOperationResult<T> {
        Result: T;
        Success: boolean;
        Errors: string[];
    }
    export interface CreatedResponse {
        Id: string;
    }
}