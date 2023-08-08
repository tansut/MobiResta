using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Web.UI.Results
{
    public class AjaxResult<T> : IAjaxResult<T>
    {
        private T _responseData;
        private bool _succeed;

        public T ResponseData
        {
            get
            {
                return _responseData;
            }

            set
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
