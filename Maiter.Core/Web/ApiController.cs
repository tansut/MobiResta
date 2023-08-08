using Maiter.Core.Security;
using System.Web.Http;
using Maiter.Core.Configuration;
using System.Web.Http.Controllers;
using System.Globalization;
using System.Net.Http;
using System.Threading;
using System.Collections.Generic;
using Maiter.Core.Util;

namespace Maiter.Core.Web
{
    public abstract class ApiBase : ApiController
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            CultureInfo culture = DetermineBestCulture(controllerContext.Request);

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;

            base.Initialize(controllerContext);
        }

        private static CultureInfo DetermineBestCulture(HttpRequestMessage request)
        {
            IEnumerable<string> lang;
            var cultureName = "";
            if (request.Headers.TryGetValues("PreferredLanguage", out lang))
            {
                cultureName = ((string [])lang)[0];
            } else
            {
                cultureName = request.Headers.AcceptLanguage != null && request.Headers.AcceptLanguage.Count > 0 ?
                                    request.Headers.AcceptLanguage.ToString() : "en-US";                 
                cultureName = CultureHelper.GetImplementedCulture(cultureName); 
            }
            return CultureInfo.GetCultureInfo(cultureName);
        }

        private IHostInfo host;

        protected IHostInfo Host
        {
            get
            {
                if (this.host == null)
                    this.host = ServicesConfiguration.GetService<IHostInfo>();
                return this.host;
            }
        }

        public ApiBase()
        {

        }
    }
}