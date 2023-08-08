using Maiter.Core.Business.Account;
using Maiter.Core.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Providers.Authorization
{
    public class ApplicationClaimsAuthroizationManager : ClaimsAuthorizationManager
    {
        public override bool CheckAccess(AuthorizationContext context)
        {
            var acccessible = true;

            var claimsBll = ServicesConfiguration.GetService<IClaimsBusiness>();

            if (!claimsBll.IsAuthenticated)
                return false;

            var claimType = context.Action.First().Value;

            if (claimType == ClaimTypes.Role) // rol tipinde bir yetki kontrolü varsa
            {
                foreach (var item in context.Resource)
                {
                    if (!context.Principal.HasClaim(claimType, item.Value))
                    {
                        acccessible = false;
                        break;
                    }
                }


                if (!acccessible)
                {
                    if (claimsBll.HasAllClaims(claimType, context.Resource.Select(d => d.Value).ToArray()))
                        return true;
                }
            }
            else
            {
                
                // action bazlı işlemler için
                // claimType = "List"    - context.Resource[0].Value = "Country"    gibi
                // veya kendi yazdığımız actionlar da olabilir.
                // claimType = "CanRead"  - context.Resource[0].Value = "PurchaseList" gibi  bu durumda özel kontrol koyulabilir.
            }

            return acccessible;
        }
    }
}
