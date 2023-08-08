using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Operation
{
    [TsClass(Module = "Kalitte")]
    public class CodedOperationResult<T,TError> : SimpleOperationResult<T>
    {
        public TError ErrorCode { get; set; }
    }
}
