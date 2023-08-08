using Maiter.Core.Configuration;
using Maiter.Core.Providers.Authorization;
using Maiter.Core.SignalR;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Owin;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Services;
using System.Linq;
using System.Web.Http;
using System.Web.Routing;

[assembly: OwinStartup(typeof(Maiter.Web.UI.Startup))]
namespace Maiter.Web.UI
{
    public class Startup
    {


        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            ServicesConfiguration.Configure(app, config);
            AuthenticationConfiguration.Configure(app);
            MapperConfiguration.Configure();

            WebApiConfig.Register(config);
            config.Formatters.JsonFormatter.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            config.Formatters.JsonFormatter.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new IsoDateTimeConverter() {  });

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

            app.MapSignalR<DefaultConnection>("/SignalRService");
        }
    }
}
