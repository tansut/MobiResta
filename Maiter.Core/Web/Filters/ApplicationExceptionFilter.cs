using Maiter.Core.Security;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using System.Net.Http;
using Maiter.Shared.Operation;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Maiter.Core.Web.Filters
{
    public class ApplicationExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            ProcessException(actionExecutedContext);
        }


        private string GetInnerExceptionMessage(Exception ex)
        {
            string msg = "";
            if (ex.InnerException != null)
                msg = ex.InnerException.Message;
            return msg;
        }


        private void ProcessException(HttpActionExecutedContext actionExecutedContext)
        {
            var excpt = actionExecutedContext.Exception;
            var resp = actionExecutedContext.Response = new HttpResponseMessage();

            if (excpt is BusinessException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.InternalServerError;
                WriteBusinessExceptionDetails(resp, excpt as BusinessException);

            }
            else if (excpt is TechnicalException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.InternalServerError;
                WriteTechnicalExceptionDetails(resp, excpt as TechnicalException);
            }
            else if (excpt is SecurityException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.Unauthorized;
                WriteUnauthorizedExceptionDetails(resp, excpt as Exception);
            }
            else if (excpt is NoResourceException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.BadRequest;
                WriteNoResourceExceptionDetails(resp, excpt as NoResourceException);

            }
            else if (excpt is DbEntityValidationException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.BadRequest;
                WriteDbValidationExceptionDetails(resp, excpt as DbEntityValidationException);
            }
            else if (excpt is InvalidOperationException)
            {
                resp.StatusCode = System.Net.HttpStatusCode.InternalServerError;
                WriteInvalidOperationExceptionDetails(resp, excpt as InvalidOperationException);
            }
            else
            {
                resp.StatusCode = System.Net.HttpStatusCode.InternalServerError;
                WriteUnSpecifiedExceptionDetails(resp, excpt);
            }
        }

        private void WriteUnSpecifiedExceptionDetails(HttpResponseMessage resp, Exception excpt)
        {
            resp.Content = CreateResult("Oops something went wrong, please contact us", 500, excpt);
        }

        private void WriteInvalidOperationExceptionDetails(HttpResponseMessage resp, InvalidOperationException invalidOperationException)
        {
            resp.Content = CreateResult("Oops you have done something wrong, please don't do it again", 500, invalidOperationException);
        }

        private void WriteDbValidationExceptionDetails(HttpResponseMessage resp, DbEntityValidationException dbEntityValidationException)
        {
            var error = dbEntityValidationException.EntityValidationErrors;
            List<KeyValuePair<string, string>> errors = new List<KeyValuePair<string, string>>();
            foreach (var err in error)
            {
                foreach (var item in err.ValidationErrors)
                {
                    errors.Add(new KeyValuePair<string, string>(item.PropertyName, item.ErrorMessage));
                }
            }

            resp.Content = CreateResult("Validation For The Entry Has Been Failed", 500, dbEntityValidationException, KnownException.EntityValidation, errors);
        }

        private void WriteNoResourceExceptionDetails(HttpResponseMessage resp, NoResourceException noResourceException)
        {
            resp.Content = CreateResult("The requested resource cannot be found on the server", 404, noResourceException, KnownException.NoResource);
        }

        private void WriteUnauthorizedExceptionDetails(HttpResponseMessage resp, Exception exception)
        {
            resp.Content = CreateResult("Authorization has been denied for this request", 401, exception);
        }

        private void WriteTechnicalExceptionDetails(HttpResponseMessage resp, TechnicalException technicalException)
        {
            string errData = string.IsNullOrEmpty(technicalException.Message) ?
                "A tehcnical problem has been occurred, please contact us to resolve this problem."
                : "A tehcnical problem has been occurred, please contact us to resolve this problem.Error :" + technicalException.Message;
            resp.Content = CreateResult(errData, 500, technicalException, KnownException.TechnicalException);
        }

        private void WriteBusinessExceptionDetails(HttpResponseMessage resp, BusinessException businessException)
        {
            resp.Content = CreateResult("Oops something went wrong, please contact us",500,businessException,KnownException.BusinessException);
        }

        public override Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            ProcessException(actionExecutedContext);
            return Task.FromResult(0);
        }

        private StringContent CreateResult(string message, int errorCode, Exception excp)
        {
            return this.CreateResult(message, errorCode, excp, null);
        }

        private StringContent CreateResult(string message, int errorCode, Exception excp, KnownException? knownException)
        {
            return this.CreateResult(message, errorCode, excp, knownException, null);
        }

        private StringContent CreateResult(string message, int errorCode, Exception excp, KnownException? knownException, object extraData)
        {
            var ajaxResultData = new AjaxExceptionResult(message, errorCode, Guid.NewGuid().ToString("n"), excp);

            ajaxResultData.ExtraData = extraData;

            var result = JsonConvert.SerializeObject(ajaxResultData);

            return new StringContent(result, Encoding.UTF8);
        }

        public override bool AllowMultiple
        {
            get
            {
                return false;
            }
        }

        public override bool IsDefaultAttribute()
        {
            return true;
        }
    }
}
