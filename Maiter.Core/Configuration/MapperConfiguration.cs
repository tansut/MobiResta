using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Maiter.Core.Configuration
{
    public class MapperConfiguration
    {
        public static void Configure()
        {
           // Mapper.CreateMap<ApplicationUser, UserProfileEx>().ForMember(;

        ///    Mapper.AssertConfigurationIsValid(); // mapleme hatası varsa exception atar.
        }


        public static T Map<T>(object a)
        {
            return Mapper.Map<T>(a);
        }
    }


}
