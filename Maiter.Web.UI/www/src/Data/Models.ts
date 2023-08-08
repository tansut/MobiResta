import {Kalitte} from '../Kalitte/Data/Models';
export module ViewModels.Mobile {
}
export module ViewModels.Common {
	export module TagContent {
		export var TAGDOMAIN: string = "http://www.mobiresta.com/tag/";
	}
}
export module System.Collections.Generic {
}
export module ViewModels.Company {
	export module WorkItemConstant {
		export var Visuals: string = "visuals";
		export var Employee: string = "employees";
		export var Tables: string = "table";
		export var Sections: string = "sections";
		export var Workhours: string = "workhours";
	}
}
export module ViewModels.Mobile.RequestTypes {
	export module CheckInRequest {
		export var RequestType: string = "checkIn";
	}
	export module CheckInRequestType {
		export var Name: string = "checkIn";
	}
	export module CustomRequestType {
		export var Name: string = "custom";
	}
	export module ChatRequestType {
		export var Name: string = "chat";
	}
	export module ChatRequest {
		export var RequestType: string = "chat";
	}
	export module CustomRequest {
		export var RequestType: string = "custom";
	}
	export module CallRequest {
		export var RequestType: string = "call";
	}
	export module PayRequest {
		export var RequestType: string = "pay";
	}
	export module CallRequestType {
		export var Name: string = "call";
	}
	export module PayRequestType {
		export var Name: string = "pay";
	}
	export module FeedbackRequestType {
		export var Name: string = "feedback";
	}
	export module PrepareCarRequestType {
		export var Name: string = "car";
	}
	export module TaxiRequestType {
		export var Name: string = "taxi";
	}
}
export module Data {
}
export module ViewModels.Messaging {
	export module ReadMessage {
		export var TYPE: string = "ReadMessage";
	}
	export module SentMessage {
		export var TYPE: string = "SentMessage";
	}
	export module ChatMessage {
		export var TYPE: string = "ChatMessage";
	}
	export module StatusMessage {
		export var TYPE: string = "StatusMessage";
	}
	export module CustomerRequestMessage {
		export var TYPE: string = "CustomerRequestMessage";
	}
}
module Foo {
}
export module Entity {
	export module Company {
		export var EntityName: string = "Company";
	}
	export module CompanySection {
		export var EntityName: string = "CompanySection";
	}
	export module ResTable {
		export var EntityName: string = "ResTable";
	}
	export module CompanyUser {
		export var EntityName: string = "Menu";
	}
	export module CompanyAppMenuItem {
		export var EntityName: string = "CompanyAppMenu";
	}
	export module Menu {
		export var EntityName: string = "Menu";
	}
	export module MenuSection {
		export var EntityName: string = "MenuSection";
	}
	export module Food {
		export var EntityName: string = "Food";
	}
}
export module System.Data.Entity.Spatial {
}
export module ViewModels.Account {
}
export module Security {
	export module RoleConstants {
		export var Admin: string = "coadmin";
		export var Customer: string = "customer";
	}
}

export module ViewModels.Mobile {
	export enum CustomerSessionType {
		Offline = 0,
		Restaurant = 1,
		Table = 2
	}
	export interface WorkerRequestType extends ViewModels.Mobile.RequestType {
	}
	export interface RequestType {
		TargetService: ViewModels.Company.ServiceKind;
		Group: ViewModels.Common.GlobalContent<string>;
		Title: ViewModels.Common.GlobalContent<string>;
		FormatString: ViewModels.Common.GlobalContent<string>;
		Disabled: boolean;
		DisplayOrder: number;
		Icon: string;
		Name: string;
	}
	export interface CustomerRequestType extends ViewModels.Mobile.RequestType {
	}
	export interface CheckInResponse {
		CheckId: string;
	}
	export interface CustomerCheckInResponse extends ViewModels.Mobile.CheckInResponse {
		CompanyName: string;
		CompanyDesc: string;
		SectionName: string;
		TableName: string;
		SessionType: ViewModels.Mobile.CustomerSessionType;
		CompanyId: string;
		SectionId: string;
		TableId: string;
		CompanyAttachments: ViewModels.Mobile.EntityAttachmentViewModel[];
		AvailableRequests: ViewModels.Mobile.RequestType[];
		AppMenuItems: ViewModels.Company.CompanyAppMenuItemViewModel[];
		Menu: ViewModels.Mobile.MenuViewModel[];
	}
	export interface EntityAttachmentViewModel {
		Url: string;
		Id: string;
		Title: string;
		Desc: string;
		ContentType: string;
		AttachmentType: Entity.AttachmentType;
	}
	export interface MenuViewModel {
		Id: string;
		Name: string;
		Desc: string;
		Language: string;
		DisplayOrder: number;
		Images: ViewModels.Mobile.EntityAttachmentViewModel[];
		Videos: ViewModels.Mobile.EntityAttachmentViewModel[];
		AllTags: ViewModels.Mobile.EntityTagViewModel[];
		Sections: ViewModels.Mobile.MenuSectionViewModel[];
		Foods: ViewModels.Mobile.MenuFoodViewModel[];
	}
	export interface EntityTagViewModel {
		Id: string;
		Name: string;
	}
	export interface MenuSectionViewModel {
		Id: string;
		Name: string;
		Desc: string;
		DisplayOrder: number;
		Images: ViewModels.Mobile.EntityAttachmentViewModel[];
		Videos: ViewModels.Mobile.EntityAttachmentViewModel[];
		AllTags: ViewModels.Mobile.EntityTagViewModel[];
		Foods: ViewModels.Mobile.MenuFoodViewModel[];
		Menu: ViewModels.Mobile.MenuViewModel;
	}
	export interface MenuFoodViewModel {
		Id: string;
		Name: string;
		Desc: string;
		RichDesc: string;
		Images: ViewModels.Mobile.EntityAttachmentViewModel[];
		Videos: ViewModels.Mobile.EntityAttachmentViewModel[];
		Tags: ViewModels.Mobile.EntityTagViewModel[];
		Price: number;
		Currency: string;
		Modifiers: ViewModels.Mobile.MenuFoodItem[];
		Items: ViewModels.Mobile.MenuFoodItem[];
		Section: ViewModels.Mobile.MenuSectionViewModel;
	}
	export interface MenuFoodItem {
		Id: string;
		Name: string;
		Desc: string;
		SubItems: ViewModels.Mobile.MenuFoodSubItem[];
		SelectionType: Entity.FoodPropertySelectionType;
		Required: boolean;
		ItemSelectionLimit: number;
		ShowTitleToUser: boolean;
		DisplayInMenu: boolean;
		PriceType: Entity.FoodPriceType;
		SingleSelectedItem: string;
	}
	export interface MenuFoodSubItem {
		Id: string;
		Price: number;
		Name: string;
		Desc: string;
		IsSelected: boolean;
	}
	export interface WorkerCheckInResponse extends ViewModels.Mobile.CheckInResponse {
		CompanyId: string;
		CompanyName: string;
		CompanyDesc: string;
		Roles: ViewModels.Company.ServiceKind[];
		AvailableRequests: ViewModels.Mobile.RequestType[];
	}
	export interface ShoppingCardItem {
		FoodId: string;
		Desc: string;
		Amount: number;
		TotalPrice: number;
		FoodRef: ViewModels.Mobile.MenuFoodViewModel;
		OrderItems: {[key: string]:  ViewModels.Mobile.FoodSubItemSelection};
	}
	export interface FoodSubItemSelection {
		ItemId: string;
		Id: string;
		Desc: string;
		Price: number;
		ItemRef: ViewModels.Mobile.MenuFoodItem;
		SubItemRef: ViewModels.Mobile.MenuFoodSubItem;
	}
}
export module ViewModels.Common {
	export enum TagType {
		Offline = 0,
		Restaurant = 1,
		Table = 2
	}
	export enum UserType {
		Customer = 0,
		Worker = 1
	}
	export interface GlobalContent<T> {
		Values: {[key: string]:  T};
		Value: T;
	}
	export interface TagContent {
		Type: ViewModels.Common.TagType;
		Version: string;
		Id: string;
		Sign: string;
	}
}
export module System.Collections.Generic {
	export interface KeyValuePair<TKey, TValue> {
		Key: TKey;
		Value: TValue;
	}
}
export module ViewModels.Company {
	export enum ServiceKind {
		Default = 0,
		Other = 1,
		Customer = 2,
		Worker = 4,
		CRM = 8,
		Waiter = 16,
		Vale = 32
	}
	export enum WorkItem {
		Visuals = 0,
		Employee = 1,
		Tables = 2,
		Menu = 3,
		Sections = 4,
		Workhours = 5,
		AppMenuItems = 6,
		CustomerRequests = 7
	}
	export enum Completeness {
		Done = 0,
		None = 1,
		Partial = 2
	}
	export interface CompanyAppMenuItemViewModel {
		Id: string;
		Title: string;
		Desc: string;
		Url: string;
		Content: string;
		DisplayType: Entity.AppMenuDisplayOption;
		Images: ViewModels.Mobile.EntityAttachmentViewModel[];
		Videos: ViewModels.Mobile.EntityAttachmentViewModel[];
	}
	export interface ServiceInfo {
		Title: ViewModels.Common.GlobalContent<string>;
	}
	export interface ServiceDefaults {
	}
	export interface TableGeneration extends Kalitte.EntityBase {
		CompanySectionId: string;
		Prefix: string;
		PostFix: string;
		Start: number;
		Finish: number;
		Digits: number;
		Group: string;
		Tags: string[];
	}
	export interface WorkItemConstant {
	}
	export interface WorkItemStatus {
		Item: ViewModels.Company.WorkItem;
		Status: ViewModels.Company.Completeness;
	}
	export interface CompanyWithWorkItemStatus {
		Company: Entity.Company;
		WorkItems: ViewModels.Company.WorkItemStatus[];
	}
}
export module ViewModels.Mobile.RequestTypes {
	export enum PaymentType {
		CreditCard = 0,
		Cash = 1,
		Other = 2
	}
	export enum Face {
		Happy = 0,
		Sad = 1
	}
	export interface RequestContent {
	}
	export interface RequestBagBase {
		CheckInId: string;
		CompanyId: string;
		CompanySectionId: string;
		TableId: string;
		UserText: string;
		Target: ViewModels.Company.ServiceKind;
		Source: ViewModels.Company.ServiceKind;
		Location: Data.GeoPoint;
	}
	export interface RequestBag<T> extends ViewModels.Mobile.RequestTypes.RequestBagBase {
		RequestContent: T;
	}
	export interface CheckInRequest extends ViewModels.Mobile.RequestTypes.RequestContent {
		Tag: ViewModels.Common.TagContent;
	}
	export interface CheckInRequestType extends ViewModels.Mobile.RequestType {
	}
	export interface CustomRequestType extends ViewModels.Mobile.RequestType {
	}
	export interface ChatRequestType extends ViewModels.Mobile.RequestType {
	}
	export interface ChatRequest extends ViewModels.Mobile.RequestTypes.RequestContent {
		ToUserId: string;
	}
	export interface CustomRequest extends ViewModels.Mobile.RequestTypes.RequestContent {
	}
	export interface CallRequest extends ViewModels.Mobile.RequestTypes.RequestContent {
	}
	export interface PayRequest extends ViewModels.Mobile.RequestTypes.RequestContent {
		Payment: string;
	}
	export interface CallRequestType extends ViewModels.Mobile.CustomerRequestType {
	}
	export interface PayRequestType extends ViewModels.Mobile.CustomerRequestType {
	}
	export interface FeedbackRequestType extends ViewModels.Mobile.CustomerRequestType {
		Status: ViewModels.Mobile.RequestTypes.Face;
	}
	export interface HapplyFeedbackRequestType extends ViewModels.Mobile.RequestTypes.FeedbackRequestType {
	}
	export interface SadFeedbackRequestType extends ViewModels.Mobile.RequestTypes.FeedbackRequestType {
	}
	export interface PrepareCarRequestType extends ViewModels.Mobile.CustomerRequestType {
	}
	export interface TaxiRequestType extends ViewModels.Mobile.CustomerRequestType {
	}
}
export module Data {
	export interface GeoPoint {
		Lat: number;
		Long: number;
	}
}
export module ViewModels.Messaging {
	export enum MessageState {
		Created = 1,
		Transferred = 2,
		Sent = 4,
		Read = 8,
		Received = 16,
		Replied = 32
	}
	export interface ReadMessage extends ViewModels.Messaging.MessageBase {
		AdditionalIds: string[];
	}
	export interface MessageBase {
		Id: string;
		ToUserId: string;
		FromUserId: string;
		FromService: ViewModels.Company.ServiceKind;
		ToService: ViewModels.Company.ServiceKind;
		State: ViewModels.Messaging.MessageState;
		CreatedAt: Date;
	}
	export interface SentMessage extends ViewModels.Messaging.MessageBase {
		AdditionalIds: string[];
	}
	export interface ClientMessageBase {
		MessageType: string;
	}
	export interface ClientMessage<T> extends ViewModels.Messaging.ClientMessageBase {
		MessageContent: T;
	}
	export interface ChatMessage extends ViewModels.Messaging.MessageBase {
		ToUserName: string;
		UserContent: string;
		FromUserName: string;
	}
	export interface StatusMessage extends ViewModels.Messaging.MessageBase {
		Online: boolean;
	}
	export interface RequestMessage extends ViewModels.Messaging.ChatMessage {
	}
	export interface WorkerRequestMessage extends ViewModels.Messaging.RequestMessage {
	}
	export interface CustomerRequestMessage extends ViewModels.Messaging.RequestMessage {
		RequestType: string;
		RequestContent: ViewModels.Mobile.RequestTypes.RequestContent;
	}
	export interface RequestResponse {
		Id: string;
		ToUserId: string;
		ToUserName: string;
		ToService: ViewModels.Company.ServiceKind;
		MessageType: string;
		CreatedAt: Date;
	}
}
module Foo {
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
export module Entity {
	export enum AttachmentType {
		Image = 0,
		VideoLink = 1
	}
	export enum AppMenuDisplayOption {
		DisplayAsWelcome = 0,
		DisplayAsHome = 1,
		Both = 2
	}
	export enum FoodPropertySelectionType {
		Single = 1,
		Multiple = 2,
		MultipleLimited = 4
	}
	export enum FoodPriceType {
		Net = 1,
		Modifier = 2
	}
	export enum TableSelectionType {
		InSelection = 0,
		All = 1
	}
	export enum ServiceUserStatus {
		Requested = 0,
		Accepted = 1,
		Declined = 2
	}
	export enum MenuDisplayOption {
		None = 0,
		DisplayAlways = 1,
		DisplayByLanguage = 2
	}
	export enum Gender {
		Unspecified = 0,
		Male = 1,
		Female = 2,
		Other = 3
	}
	export enum FoodSubItemType {
		SubItem = 1,
		Modifier = 2
	}
	export enum TagDisplayOption {
		Visible = 0,
		Internal = 1
	}
	export interface Company extends Kalitte.EntityBase {
		Name: string;
		Desc: string;
		Location: Data.GeoPoint;
		DBLocation: System.Data.Entity.Spatial.DbGeography;
		Sections: Entity.CompanySection[];
		Users: Entity.CompanyUser[];
		AppMenuItems: Entity.CompanyAppMenuItem[];
		DisabledCustomerRequests: Entity.CompanyCustomerRequest[];
		MenuRelations: Entity.CompanyMenu[];
		OwnerId: string;
		Attachments: Entity.EntityAttachment[];
		WorkItems: ViewModels.Company.WorkItemStatus[];
		ManagementService: Entity.ManagerResponsibility;
		ValeService: Entity.ValeResponsibility;
		CountryName: string;
		StateName: string;
		CityName: string;
		City: Entity.City;
		CityId: string;
		Adress1: string;
		Adress2: string;
		PostCode: string;
		TimeZone: string;
		Daylight: boolean;
		BarcodeID: string;
		BarcodeContent: string;
		BarcodeVersion: string;
	}
	export interface CompanySection extends Kalitte.EntityBase {
		Name: string;
		Desc: string;
		CompanyId: string;
		Attachments: Entity.EntityAttachment[];
		Tables: Entity.ResTable[];
		ManagementService: Entity.ManagerResponsibility;
		TableService: Entity.TableResponsibility[];
	}
	export interface EntityAttachment extends Entity.EntityInfo {
		FileName: string;
		Title: string;
		Desc: string;
		DisplayOrder: number;
		Content: number[];
		ContentType: string;
		AttachmentType: Entity.AttachmentType;
		Length: number;
	}
	export interface EntityInfo extends Kalitte.EntityBase {
		EntityName: string;
		EntityId: string;
	}
	export interface ResTable extends Kalitte.EntityBase {
		SectionId: string;
		Name: string;
		TableGroup: string;
		Desc: string;
		Number: number;
		Attachments: Entity.EntityAttachment[];
		Tags: Entity.EntityTag[];
		Simulated: boolean;
		BarcodeID: string;
		BarcodeContent: string;
		BarcodeVersion: string;
	}
	export interface EntityTag extends Entity.EntityInfo {
		Name: string;
	}
	export interface ManagerResponsibility extends Entity.Responsibility<Entity.CompanyManager> {
	}
	export interface Responsibility<T> {
		ResourceData: T;
		Timing: {[key: number]:  Entity.TimingInfo};
	}
	export interface TimingInfo {
		Users: Entity.TimeBasedUsers[];
	}
	export interface TimeBasedUsers {
		Start: Date;
		Finish: Date;
		Workloads: Entity.UserWorkLoad[];
	}
	export interface UserWorkLoad {
		UserId: string;
		Display: string;
		Workload: number;
		AsBackcup: boolean;
	}
	export interface CompanyManager {
	}
	export interface TableResponsibility extends Entity.Responsibility<Entity.TableSelection> {
	}
	export interface TableSelection {
		Id: string;
		Title: string;
		Selection: Entity.TableSelectionType;
		Expression: string;
		Priority: number;
	}
	export interface CompanyUser extends Kalitte.EntityBase {
		UserId: string;
		Display: string;
		Desc: string;
		CompanyId: string;
		EMail: string;
		Status: Entity.ServiceUserStatus;
		Company: Entity.Company;
		Enabled: boolean;
		_roles: ViewModels.Company.ServiceKind[];
		Roles: ViewModels.Company.ServiceKind[];
	}
	export interface CompanyAppMenuItem extends Kalitte.EntityBase {
		CompanyId: string;
		Company: Entity.Company;
		DisplayOrder: number;
		Title: string;
		Desc: string;
		Content: string;
		Language: string;
		Attachments: Entity.EntityAttachment[];
		DisplayOption: Entity.MenuDisplayOption;
		DisplayType: Entity.AppMenuDisplayOption;
	}
	export interface CompanyCustomerRequest extends Kalitte.EntityBase {
		CompanyId: string;
		RequestName: string;
		Disabled: boolean;
		TargetService: ViewModels.Company.ServiceKind;
	}
	export interface CompanyMenu extends Kalitte.EntityBase {
		CompanyId: string;
		MenuId: string;
		Company: Entity.Company;
		Menu: Entity.Menu;
	}
	export interface Menu extends Kalitte.EntityBase {
		Name: string;
		Desc: string;
		Sections: Entity.MenuSection[];
		Attachments: Entity.EntityAttachment[];
		CompanyIds: string[];
		Language: string;
		DisplayOrder: number;
		DisplayOption: Entity.MenuDisplayOption;
	}
	export interface MenuSection extends Kalitte.EntityBase {
		Name: string;
		Desc: string;
		MenuId: string;
		DisplayOrder: number;
		Attachments: Entity.EntityAttachment[];
		Foods: Entity.Food[];
	}
	export interface Food extends Kalitte.EntityBase {
		InternalCode: string;
		Name: string;
		Desc: string;
		RichDesc: string;
		MenuSectionId: string;
		Currency: string;
		Price: number;
		Attachments: Entity.EntityAttachment[];
		Tags: Entity.EntityTag[];
		DisplayOrder: number;
		FoodProperties: Entity.FoodProperty[];
	}
	export interface FoodProperty extends Kalitte.EntityBase {
		FoodId: string;
		Food: Entity.Food;
		PriceType: Entity.FoodPriceType;
		SelectionType: Entity.FoodPropertySelectionType;
		Required: boolean;
		ItemSelectionLimit: number;
		Name: string;
		Desc: string;
		FoodPropertyItems: Entity.FoodPropertyItem[];
		ShowTitleToUser: boolean;
		DisplayInMenu: boolean;
		DisplayOrder: number;
	}
	export interface FoodPropertyItem extends Kalitte.EntityBase {
		FoodPropertyId: string;
		Property: Entity.FoodProperty;
		Price: number;
		DisplayOrder: number;
		Name: string;
		Desc: string;
		AutoSelect: boolean;
	}
	export interface ValeResponsibility extends Entity.Responsibility<Entity.Vale> {
	}
	export interface Vale {
	}
	export interface City extends Kalitte.EntityBase {
		Name: string;
		State: Entity.CountryState;
		StateId: string;
	}
	export interface CountryState extends Kalitte.EntityBase {
		Name: string;
		Country: Entity.Country;
		CountryId: string;
		City: Entity.City[];
	}
	export interface Country extends Kalitte.EntityBase {
		Name: string;
		NativeName: string;
		SortName: string;
		State: Entity.CountryState[];
	}
	export interface IEntity {
		Id: string;
	}
	export interface Culture {
		Code: string;
		Name: string;
		NativeName: string;
		CurrencySymbol: string;
	}
	export interface RequestLog extends Kalitte.EntityBase {
		CompanyId: string;
		CompanyName: string;
		SectionId: string;
		SectionName: string;
		TableId: string;
		TableName: string;
		Anonymous: boolean;
		RequestType: string;
		CheckInId: string;
		ReferenceRequestId: string;
		Location: Data.GeoPoint;
		RequestInstance: ViewModels.Mobile.RequestTypes.RequestContent;
		UserContent: string;
		RequestContent: string;
		TargetService: ViewModels.Company.ServiceKind;
		SourceService: ViewModels.Company.ServiceKind;
	}
}
export module System.Data.Entity.Spatial {
	export interface DbGeography {
		DefaultCoordinateSystemId: number;
		ProviderValue: any;
		Provider: System.Data.Entity.Spatial.DbSpatialServices;
		WellKnownValue: System.Data.Entity.Spatial.DbGeographyWellKnownValue;
		CoordinateSystemId: number;
		Dimension: number;
		SpatialTypeName: string;
		IsEmpty: boolean;
		ElementCount: number;
		Latitude: number;
		Longitude: number;
		Elevation: number;
		Measure: number;
		Length: number;
		StartPoint: System.Data.Entity.Spatial.DbGeography;
		EndPoint: System.Data.Entity.Spatial.DbGeography;
		IsClosed: boolean;
		PointCount: number;
		Area: number;
	}
	export interface DbSpatialServices {
		Default: System.Data.Entity.Spatial.DbSpatialServices;
		NativeTypesAvailable: boolean;
	}
	export interface DbGeographyWellKnownValue {
		CoordinateSystemId: number;
		WellKnownText: string;
		WellKnownBinary: number[];
	}
}
export module ViewModels.Account {
	export interface WorkerCompanyInfo {
		CompanyId: string;
		Roles: ViewModels.Company.ServiceKind[];
		CompanyName: string;
	}
	export interface WorkerInfo {
		DefaultCompanyId: string;
		Companies: ViewModels.Account.WorkerCompanyInfo[];
	}
	export interface UserProfile {
		Name: string;
		Surname: string;
		BirthDate: Date;
		Gender: Entity.Gender;
		ProfilePictureAttachmentInfo: Entity.EntityAttachment;
		Email: string;
		Phone: string;
	}
}
export module Security {
	export interface RoleConstants {
	}
}
