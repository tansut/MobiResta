import { Meta } from '../../Kalitte/Core/Meta';
import { App } from '../../Kalitte/Core/Application';
import { $q, $rootScope, $localStorage } from '../../Kalitte/Vendor/AngularService';
import { SignalRConnection } from '../../Kalitte/Vendor/SignalRConnectionService';
import { BaseService } from '../../Kalitte/Core/BaseService';
import { Account } from '../../Kalitte/Data/AccountService';
import { Remote, EntityService } from '../../Kalitte/Data/RemoteService';
import { CustomerSession } from './CustomerSession';
import { WorkerSession } from './WorkerSession';
import {ViewModels} from '../../Data/Models';

export var Session: SessionService;

@Meta.Service('SessionService')
export class SessionService extends BaseService {

    static $Service: EntityService<any>;

    public Customer: CustomerSession;
    public Worker: WorkerSession;

    private signalRHeaders: { [id: string]: any }

    DisconnectAll() {
        return $q.all([this.DisconnectWorker(), this.DisconnectCustomer()]);
    }

    MessagingActive() {
        return SignalRConnection.IsActive();
    }

    getSignalRHeaders(headers) {
        var authData = $localStorage.get<any>(App.Config.AuthStorageKey);
        if (authData) {
            angular.extend(headers, { "access_token": authData.access_token });
        }
        return headers;
    }

    connectSignalR(headers) {
        this.signalRHeaders = this.getSignalRHeaders(headers);
        return SignalRConnection.Connect(headers).then(() => {

        });
    }

    public CreateWorkerSession(request: ViewModels.Mobile.RequestTypes.CheckInRequest, companyId: string): ng.IPromise<WorkerSession> {

        var bag = <ViewModels.Mobile.RequestTypes.RequestBag<ViewModels.Mobile.RequestTypes.CheckInRequest>>{
            Location: {
                Lat: 0,
                Long: 0
            },
            CheckInId: "",
            RequestContent: request,
            Source: ViewModels.Company.ServiceKind.Worker,
            Target: ViewModels.Company.ServiceKind.Worker,
            UserText: "",
            CompanyId: companyId,
            CompanySectionId: "",
            TableId: ""
        }

        return $q.all([this.DisconnectWorker(), this.DisconnectCustomer()]).then(() => {
            return SessionService.$Service.Call<ViewModels.Mobile.WorkerCheckInResponse>("WorkerCheckInRequest", {}, bag).then((result) => {

                var headers: { [id: string]: any } = {
                    "companyId": result.CompanyId,
                    "source": ViewModels.Company.ServiceKind.Worker
                };

                return this.connectSignalR(headers).then(() => {
                    this.Worker = new WorkerSession(result);
                    $rootScope.$broadcast("WorkerSessionCreated", this.Worker);
                    return this.Worker;
                });
            });
        });
    }

    public CreateCustomerSession(request: ViewModels.Mobile.RequestTypes.CheckInRequest): ng.IPromise<CustomerSession> {
        var bag = <ViewModels.Mobile.RequestTypes.RequestBag<ViewModels.Mobile.RequestTypes.CheckInRequest>>{
            Location: {
                Lat: 0,
                Long: 0
            },
            CheckInId: "",
            RequestContent: request,
            Source: ViewModels.Company.ServiceKind.Customer,
            Target: ViewModels.Company.ServiceKind.Customer,
            UserText: "",
            CompanyId: "",
            CompanySectionId: "",
            TableId: ""
        }
        return $q.all([this.DisconnectWorker(), this.DisconnectCustomer()]).then(() => {
            return SessionService.$Service.Call<ViewModels.Mobile.CustomerCheckInResponse>("CustomerCheckInRequest", {}, bag).then((result) => {
                var headers: { [id: string]: any } = {
                    "companyId": result.CompanyId,
                    "companySectionId": result.SectionId,
                    "tableId": result.TableId,
                    "source": ViewModels.Company.ServiceKind.Customer
                };
                if (Account.principal.isAuthenticated && result.SessionType == ViewModels.Mobile.CustomerSessionType.Table) {
                    return this.connectSignalR(headers).then(() => {
                        this.Customer = new CustomerSession(result);
                        $rootScope.$broadcast("CustomerSessionCreated", this.Customer);
                        return this.Customer;
                    });
                } else {
                    this.Customer = new CustomerSession(result);
                    $rootScope.$broadcast("CustomerSessionCreated", this.Customer);
                    return this.Customer;
                }
            });
        });
    }

    static InstanceReady(instance) {
        Session = instance;
    }

    public DisconnectCustomer(): ng.IPromise<any> {
        var promises = [];
        if (this.Customer)
            promises.push(this.Customer.Disconnect());
        if (SignalRConnection.IsActive())
            promises.push(SignalRConnection.Disconnect());
        return $q.all(promises).then(() => {
            this.Customer = undefined;
            if (promises.length)
                $rootScope.$broadcast("CustomerSessionDisconnected");
        });
    }

    public DisconnectWorker(): ng.IPromise<any> {
        var promises = [];
        if (this.Worker)
            promises.push(this.Worker.Disconnect());
        if (SignalRConnection.IsActive())
            promises.push(SignalRConnection.Disconnect());
        return $q.all(promises).then(() => {
            this.Worker = undefined;
            if (promises.length)
                $rootScope.$broadcast("WorkerSessionDisconnected");
        });
    }

    constructor() {
        super();
        SessionService.$Service = Remote.Entity("Request");
        $rootScope.$on('Authentication:AccessTokenUpdated', (evt, arg) => {
            if ((this.Worker || this.Customer)) {
                console.log('Security tokens refreshed. Setting new SignalR headers.');
                SignalRConnection.SetNewHeaders(this.getSignalRHeaders(this.signalRHeaders));
                //var signalRDefer = $q.defer();
                //arg['promise'] = signalRDefer.promise;
                //SignalRConnection.Disconnect(false).then(() => {
                //    console.log('Security tokens refreshed. Reconnecting SignalR.');
                //    this.connectSignalR(this.signalRHeaders).then(() => signalRDefer.resolve(), (err) => signalRDefer.reject(err));
                //});
            }
        });
    }
}