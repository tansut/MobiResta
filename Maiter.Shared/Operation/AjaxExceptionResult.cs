using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Operation
{
    [TsClass(Module = "Kalitte")]
    public class AjaxExceptionResult
    {
        public AjaxExceptionResult(string msg, int errorCode, string codeIdentifier, Exception excp)
        {
            this.Message = msg;
            this.ErrorCode = errorCode;
            this.CodeIdentifier = codeIdentifier;

#if DEBUG
            this.ExceptionMessage = excp.Message;
            this.StackTrace = excp.StackTrace;
#endif

        }

        public AjaxExceptionResult(string msg, int errorCode, string codeIdentifier, Exception excp, KnownException knownExcp) : this(msg, errorCode, codeIdentifier, excp)
        {
            this.KnownException = knownExcp;
        }

        public string Message { get; set; }
        public int ErrorCode { get; set; }
        public string CodeIdentifier { get; set; }
        public string ExceptionMessage { get; set; }
        public string StackTrace { get; set; }
        public KnownException? KnownException { get; set; }

        public object ExtraData { get; set; }
    }


    [TsEnum(Module = "Kalitte")]
    public enum KnownException
    {
        EntityValidation,
        Unauthorized,
        KnownSecurityException,
        NoResource,
        TechnicalException,
        BusinessException
    }
}
