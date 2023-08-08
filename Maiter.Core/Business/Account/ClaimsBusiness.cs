using Maiter.Core.Db;
using Maiter.Shared.Entity;
using Maiter.Shared.Security;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business.Account
{
    public interface IClaimsBusiness
    {
        string CurrentUserId { get; }
        bool IsAuthenticated { get; }
        bool HasRole(string role);
        ApplicationUser AnonymousSystemUser { get; }
        ApplicationUser CurrentApplicationUser { get; }
        bool HasClaim(string claimType, string claimValue);
        string[] UserRoles();
        bool HasAllClaims(string claimType, params string[] claimValues);
    }

    public class ClaimsBusiness : IClaimsBusiness
    {
        private UserManager<ApplicationUser, string> _userManager;
        private ApplicationUser _currentApplicationUser;
        private ApplicationUser _anonymousSystemUser;
        public static readonly string AnonymousSystemUserId = "SoAoL_dX7kuv2ehfQCVS0Q";

        public ApplicationUser AnonymousSystemUser
        {
            get
            {
                if (_anonymousSystemUser == null)
                    this._anonymousSystemUser = this._userManager.FindById(AnonymousSystemUserId);
                return this._anonymousSystemUser;
            }
        }

        private List<ClaimWrapper> queriedClaims = new List<ClaimWrapper>();

        public ClaimsBusiness(UserManager<ApplicationUser, string> userManager)
        {
            this._userManager = userManager;
        }

        private ClaimsIdentity CurrentClaimsIdentity
        {
            get
            {
                ClaimsIdentity identity = System.Threading.Thread.CurrentPrincipal.Identity as ClaimsIdentity;
                return identity;
            }
        }


        public string CurrentUserId
        {
            get
            {
                if (CurrentClaimsIdentity != null)
                {
                    var nameIdentifier = CurrentClaimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
                    if (nameIdentifier != null)
                        return nameIdentifier.Value;
                    return "";
                }
                return "";
            }
        }

        public string CurrentUserName
        {
            get
            {
                if (CurrentClaimsIdentity != null)
                {
                    var nameClaim = CurrentClaimsIdentity.FindFirst(ClaimTypes.Name);
                    if (nameClaim != null)
                        return nameClaim.Value;
                    return "";
                }
                return "";
            }
        }

        public bool IsAuthenticated
        {
            get
            {
                return System.Threading.Thread.CurrentPrincipal.Identity.IsAuthenticated;
            }
        }

        public ApplicationUser CurrentApplicationUser
        {
            get
            {
                if (_currentApplicationUser == null && this.IsAuthenticated)
                {
                    this._currentApplicationUser = this._userManager.FindById(this.CurrentUserId);
                }
                return this._currentApplicationUser;
            }
        }

        private bool InQueriedClaims(string claimType, string claimValue, out bool? hasClaim)
        {
            var queried = queriedClaims.FirstOrDefault(d => d.ClaimType == claimType && d.ClaimValue == claimValue);
            if (queried != null)
            {
                hasClaim = queried.HasClaim;
                return true;
            }
            hasClaim = null;
            return false;
        }

        public bool HasRole(string role)
        {
            if (CurrentClaimsIdentity != null)
            {
                return CurrentClaimsIdentity.HasClaim(ClaimTypes.Role, role);
            }
            return false;
        }

        class ClaimWrapper
        {
            public string ClaimType { get; set; }
            public string ClaimValue { get; set; }
            public bool HasClaim { get; set; }
        }

        public bool HasClaim(string claimType, string claimValue)
        {
            return HasClaim(claimType, claimValue);
        }
        public bool HasClaim(string claimType, string claimValue, bool checkDb)
        {
            if (CurrentClaimsIdentity != null)
            {
                bool? hasClaim = null;
                if (InQueriedClaims(claimType, claimValue, out hasClaim))
                    return hasClaim.GetValueOrDefault();

                hasClaim = CurrentClaimsIdentity.HasClaim(claimType, claimValue);

                if (checkDb && !hasClaim.GetValueOrDefault() && !string.IsNullOrEmpty(CurrentUserId))
                {

                    var userClaims = _userManager.GetClaims(CurrentUserId);
                    var dbCheckedClaim = userClaims.FirstOrDefault(d => d.Type == claimType && d.Value == claimValue);
                    foreach (var item in userClaims)
                    {
                        queriedClaims.Add(new ClaimWrapper() { ClaimValue = item.Value, ClaimType = item.Type, HasClaim = true });
                    }

                    if (dbCheckedClaim == null)
                    {
                        queriedClaims.Add(new ClaimWrapper() { ClaimValue = claimValue, ClaimType = claimType, HasClaim = false });
                        return false;
                    }

                    return true;

                }
                else
                {
                    queriedClaims.Add(new ClaimWrapper() { HasClaim = hasClaim.Value, ClaimType = claimType, ClaimValue = claimValue });

                }

            }
            return false;
        }



        public bool HasAllClaims(string claimType, params string[] claimValues)
        {

            foreach (var item in claimValues)
            {
                if (!HasClaim(claimType, item, true))
                    return false;
            }

            return true;
        }

        public string[] UserRoles()
        {
            if (CurrentClaimsIdentity != null)
            {
                return CurrentClaimsIdentity.FindAll(ClaimTypes.Role).Select(d => d.Value).ToArray();
            }
            return new string[0];
        }
    }
}
