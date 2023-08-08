using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Operation
{
    [TsClass(Module = "Kalitte")]
    public class SimpleOperationResult<T>
    {
        public SimpleOperationResult()
        {
        }

        public T Result { get; set; }
        public bool Success { get; set; }
        public string[] Errors { get; set; }
    }
}
