import {ViewModels as VM} from './Models';

export interface WorkItemCommand {
    Name: string;
    Title: string;
    State: string;
    StateParams?: any;

}

export interface WorkItemInfo {
    Id: VM.Company.WorkItem;
    Status: VM.Company.Completeness;
    Title: string;
    Icon: string;
    Content: string;
    Commands?: Array<WorkItemCommand>;
}

export interface MenuFoodGroup {
    Id: string;
    Title: string;
    Type: string;
    Items: Array<VM.Mobile.MenuFoodViewModel>;
}
