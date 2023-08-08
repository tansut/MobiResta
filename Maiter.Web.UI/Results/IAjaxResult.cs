using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Web.UI.Results
{
    interface IAjaxResult
    {
        bool Succeed { get; set; }
    }

    interface IAjaxResult<T> : IAjaxResult
    {
        T ResponseData { get; set; }
    }
}
