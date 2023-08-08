using Maiter.Shared.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Security
{
    [TsClass]
    public class RoleConstants
    {
        //public const string Waiter = "waiter";
        //public const string Manager = "comanager";
        //public const string Vale = "vale";
        public const string Admin = "coadmin";
        //public const string Other = "coother";
        public const string Customer = "customer";
    }

    [TsClass(Module = "Kalitte")]
    public class Credential
    {
        public string ID { get; set; }
        public string Password { get; set; }
        public bool UseRefreshTokens { get; set; }
    }

    [TsClass(Module = "Kalitte")]
    public class Identity
    {
        public string UserName { get; set; }
        public string Title { get; set; }

        public string UserId { get; set; }
    }

    //[TsClass]
    //public class ServiceUserIdentity: Identity
    //{
    //    public string CompanyID { get; set; }
    //    public string CompanyTitle { get; set; }
    //}

    //[TsClass]
    //public class CustomerIdentity : Identity
    //{

    //}

    //[TsClass]
    //public class CustomerCredential : Credential
    //{

    //}

    //[TsClass]
    //public class ServiceUserCredential : Credential
    //{
    //    public string CompanyID { get; set; }
    //}

    [TsClass(Module = "Kalitte")]
    public class LocalAccessTokenResponse
    {
        public string UserName { get; set; }
        public string Id { get; set; }
        public string AccessToken { get; set; }
        public double ExpiresIn { get; set; }
        public string Issued { get; set; }
        public string Expires { get; set; }
        public string TokenType { get; set; }
        public string Refresh_Token { get; set; }
    }

    [TsClass(Module = "Kalitte")]
    public class LoginResult<T> where T : Identity
    {
        public T Identity { get; set; }
        public string[] Roles { get; set; }
        public object UserData { get; set; }
    }

    [TsClass(Module = "Kalitte")]
    public class RegisterResult<T> : LoginResult<T>
        where T : Identity
    {

    }
}
