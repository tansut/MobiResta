using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Security
{

    [Serializable]
    public class NoResourceException : Exception
    {
        public NoResourceException() { }
        public NoResourceException(string message) : base(message) { }
        public NoResourceException(string message, Exception inner) : base(message, inner) { }
        protected NoResourceException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context)
        { }
    }
}
