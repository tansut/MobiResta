using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Infrastructor
{
    public interface IEntityBusiness<T> : IEntityBusinessBase<T, string>
        where T : class, IEntity, new()
    {
        bool IgnoreDos { get; set; }
    }
}
