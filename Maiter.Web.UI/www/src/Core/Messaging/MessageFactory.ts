import {ViewModels} from '../../Data/Models';
import {Dictionary} from '../../Kalitte/Core/Dictionary';

export class MessageFactory {
    static List: Dictionary<string, any> = new Dictionary<string, any>();

    static register() {
        
    }

    static foo = MessageFactory.register();
}