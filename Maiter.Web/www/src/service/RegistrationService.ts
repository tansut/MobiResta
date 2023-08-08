import {Dictionary} from '../lib/Dictionary';
import {BaseController} from '../lib/BaseController';

export var Registration: RegistrationService;



export class RegistrationService {

    public Controllers = new Dictionary<string, typeof BaseController>();

    RegisterController(name: string, clazz: typeof BaseController) {
        if (this.Controllers.Get(name))
            throw new Error('Controller ' + name + ' already registered');
        this.Controllers.Add(name, clazz);
        return clazz;
    }

    static initInstance() {
        Registration = new RegistrationService();
    }

    static run = RegistrationService.initInstance();
}


