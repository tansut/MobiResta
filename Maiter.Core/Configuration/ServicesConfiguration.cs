using Maiter.Core.Business;
using Maiter.Core.Business.Account;
using Maiter.Core.Db;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Core.Web;
using Maiter.Shared.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;

using Autofac;
using Autofac.Integration.WebApi;
using Autofac.Integration.Owin;

using Owin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Maiter.Core.Providers.Barcode;
using Maiter.Core.Services.EmailService;
using Maiter.Core.Services.Authorization;

namespace Maiter.Core.Configuration
{
    public static class ServicesConfiguration
    {

        public static void Configure(IAppBuilder app, HttpConfiguration config)
        {
            var builder = new ContainerBuilder();


            RegisterServices(builder);

            builder.RegisterApiControllers(Assembly.GetCallingAssembly());

            var container = builder.Build();
            var autofacDepResolver = new AutofacWebApiDependencyResolver(container);

            config.DependencyResolver = autofacDepResolver;
            //GlobalConfiguration.Configuration.DependencyResolver = autofacDepResolver;
            ServiceKernel = container;

            app.UseAutofacMiddleware(container);

            app.UseAutofacWebApi(config);

            //  IKernel ninjectKernel = CreateKernel(config);
            //  DIKernel = ninjectKernel;

            //app.UseNinjectMiddleware(CreateKernel);
            //app.UseNinjectWebApi(config);
        }

        private static IContainer ServiceKernel { get; set; }

        //private static IKernel CreateKernel(HttpConfiguration config)
        //{
        //    var kernel = new StandardKernel();
        //    kernel.Load();
        //    RegisterServices(kernel);

        //    var resolver = new AppDependencyResolver(kernel);
        //    GlobalConfiguration.Configuration.DependencyResolver = resolver;

        //    return kernel;
        //}


        public static T GetService<T>()
        {
            var lifeTime = HttpContext.Current.GetOwinContext().GetAutofacLifetimeScope();
            return lifeTime.Resolve<T>();
        }

        public static object GetService(Type serviceType)
        {
            var lifeTime = HttpContext.Current.GetOwinContext().GetAutofacLifetimeScope();
            return lifeTime.Resolve(serviceType);
        }


        private static void RegisterServices(ContainerBuilder builder)
        {
            builder.RegisterType<DbCtx>().AsSelf().As<DbContext>().As<IDbContext>().InstancePerRequest();
            builder.RegisterType<HostInfo>().AsSelf().As<IHostInfo>().InstancePerRequest();
            builder.RegisterType<UserStore<ApplicationUser>>().AsSelf().As<IUserStore<ApplicationUser, string>>().InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().AsSelf().As<UserManager<ApplicationUser, string>>().InstancePerRequest();
            builder.RegisterType<BarcodeGenerator>().As<IBarcodeGenerator>();
            builder.RegisterType(typeof(ClaimsBusiness)).AsSelf().As<IClaimsBusiness>().InstancePerRequest();
            builder.RegisterType<MailTemplater>().AsSelf().InstancePerRequest();
            builder.RegisterGeneric(typeof(EntityBusiness<>)).AsSelf().As(typeof(IEntityBusiness<>)).InstancePerRequest();

            var iclaimBusinessType = typeof(IClaimsBusiness);
            var coreAssemblyTypes = Assembly.GetAssembly(typeof(AccountBusiness)).GetTypes();
            var businessTypes = coreAssemblyTypes.Where(d => d.Namespace != null && d.Namespace.StartsWith("Maiter.Core.Business") && d.Name.ToLower().EndsWith("business"));
            foreach (var type in businessTypes)
            {
                if (type.IsInterface || type.IsAssignableFrom(iclaimBusinessType))
                    continue;
                builder.RegisterType(type).AsSelf().InstancePerRequest();
            }
        }
    }
}
