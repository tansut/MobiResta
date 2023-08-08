using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Web.Results
{
    public interface IAjaxResult
    {
        bool Succeed { get; set; }
    }

    public interface IAjaxResult<T> : IAjaxResult
    {
        T ResponseData { get; }
    }
}
