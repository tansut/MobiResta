/// <reference path="../ref/angularjs/angular.d.ts" />


import {RemoteService, EntityService} from '../Kalitte/Data/RemoteService';
import {AngularService} from '../Kalitte/Vendor/AngularService';
import {Meta} from '../Kalitte/Core/Meta';
import {BaseService} from '../Kalitte/Core/BaseService';
import {Entity, Data, ViewModels} from './Models';
import {WorkItemInfo, WorkItemCommand} from './Company';

export var Company: CompanyService;


@Meta.Service('CompanyService')
export class CompanyService extends EntityService<Entity.Company> {

    static DefaultWorkItems: Array<WorkItemInfo>;



    static InstanceReady(instance) {
        Company = <CompanyService>instance;
    }

    IdWithWorkItems(id: string) {
        return this.$http().get<ViewModels.Company.CompanyWithWorkItemStatus>(this.url('IdWithWorkItems/' + id)).then((result) => result.data);
    }

    getWorkItems() {
        return angular.copy(CompanyService.DefaultWorkItems);
    }

    static Configure(factory: typeof BaseService, app: ng.IModule) {
        var items = CompanyService.DefaultWorkItems = <Array<WorkItemInfo>>[
            {
                Id: ViewModels.Company.WorkItem.Menu, Title: 'Menüler', Content: 'Sunduğunuz hizmetlere, yemek ve içecek menülerinize müşterilerinizin mobil cihazlarından ulaşmasını sağlayın. ', Icon: 'maps:restaurant_menu', Status: ViewModels.Company.Completeness.None, Commands: <Array<WorkItemCommand>>[
                    { Name: 'menu', State: 'app.menu.new', Title: 'Menü Oluştur' }, { Name: 'menus', State: 'app.menu.list', Title: 'Mevcut Menüler' }]
            },

            {
                Id: ViewModels.Company.WorkItem.Sections, Title: 'Restaurant Bölümleri', Content: 'Örneğin giriş katı, teras veya bahçe şeklinde tanımlayabilir, bölümlere özel görseller belirleyebilirsiniz.', Icon: 'social:domain', Status: ViewModels.Company.Completeness.Done, Commands: <Array<WorkItemCommand>>[
                    { Name: 'sections', State: 'app.company.sections', Title: 'Bölümleri belirle' }]
            },
            {
                Id: ViewModels.Company.WorkItem.Tables, Title: 'Masa Düzeni', Content: 'Masa düzenini belirlemek, müşteri talepleriyle masaları ilişkilendirmek ve rezervasyon sistemi için gereklidir.  .', Icon: 'action:view_list', Status: ViewModels.Company.Completeness.Done, Commands: <Array<WorkItemCommand>>[
                    { Name: 'sections', State: 'app.company.sections', StateParams: { target: 'tables' }, Title: 'Masaları belirle' }]
            },

            {
                Id: ViewModels.Company.WorkItem.Employee, Title: 'Çalışanlar', Content: 'Servis personeli, vale veya işletmenizden sorumlu yönetici rollerine sahip kullanıcıları tanımlayı, yönetin.', Icon: 'social:people', Status: ViewModels.Company.Completeness.None, Commands: <Array<WorkItemCommand>>[
                    { Name: 'worker', State: 'app.company.users.new', Title: 'Çalışan Ekle' }, { Name: 'go', State: 'app.company.users', Title: 'Çalışan Listesi' }]
            },
            {
                Id: ViewModels.Company.WorkItem.Workhours, Title: 'İş planlaması', Content: 'Çalışanlarınızın saat bazında iş planlamasını yapın, gerektiğinde yedek personel tanımlarıyla kesintisiz hizmet verin.', Icon: 'action:schedule', Status: ViewModels.Company.Completeness.None, Commands: <Array<WorkItemCommand>>[
                    { Name: 'plan', State: 'app.company.schedule.manage', Title: 'İş Planlaları' }]
            },
            {
                Id: ViewModels.Company.WorkItem.Visuals, Title: 'Restaurant Fotoğrafları', Content: 'Müşterilerinizin mobil cihazlarında ana sayfada görüntülenecek restaurant fotoğraflarını belirleyin.', Icon: 'image:color_lens', Status: ViewModels.Company.Completeness.Done, Commands: <Array<WorkItemCommand>>[
                    { Name: 'photos', State: 'app.attachment', Title: 'Görselleri Seç' }]
            },
            {
                Id: ViewModels.Company.WorkItem.AppMenuItems, Title: 'Restaurant Uygulama', Content: 'xxxxxxxxxxxxx', Icon: 'image:color_lens', Status: ViewModels.Company.Completeness.Done, Commands: <Array<WorkItemCommand>>[
                    { Name: 'appMenuItems', State: 'app.company.appmenus', Title: 'Uygulama menüleri' }]
            },
            {
                Id: ViewModels.Company.WorkItem.CustomerRequests, Title: 'Available Customer Requests', Content: 'xxxxxxxxxxxxx', Icon: 'image:color_lens', Status: ViewModels.Company.Completeness.Done, Commands: <Array<WorkItemCommand>>[
                    { Name: 'customerRequests', State: 'app.company.customerrequest.list', Title: 'Set Customer Requests' }]
            },
        ];

        BaseService.Configure(CompanyService, app);
    }

    constructor() {
        super('company');
    }
}