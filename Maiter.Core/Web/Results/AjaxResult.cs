using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Web.Results
{
    public class AjaxResult<T> : IAjaxResult<T>
    {
        public AjaxResult(T resultData)
        {
            ResponseData = resultData;
        }

        public AjaxResult()
        {
        }

        private T _responseData;
        private bool _succeed;

        public T ResponseData
        {
            get
            {
                return _responseData;
            }

            private set
            {
                _responseData = value;
            }
        }

        public bool Succeed
        {
            get
            {
                return _succeed;
            }

            set
            {
                _succeed = value;
            }
        }
    }
}
