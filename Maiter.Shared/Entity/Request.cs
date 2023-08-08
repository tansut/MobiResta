using Maiter.Shared.Data;
using Maiter.Shared.ViewModels.Company;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    [TsClass]
    public class RequestLog : EntityBase
    {
        [Required]
        [StringLength(22)]
        public string CompanyId { get; set; }

        [StringLength(255)]
        public string CompanyName { get; set; }

        [StringLength(22)]
        public string SectionId { get; set; }

        [StringLength(255)]
        public string SectionName { get; set; }

        [StringLength(22)]
        public string TableId { get; set; }

        [StringLength(255)]
        public string TableName { get; set; }        

        [Required]
        public bool Anonymous { get; set; }

        [Required]
        [StringLength(25)]
        public string RequestType { get; set; }

        [Required]
        [StringLength(22)]
        public string CheckInId { get; set; }

        [StringLength(22)]
        public string ReferenceRequestId { get; set; }

        //[ForeignKey("SessionId")]
        //public virtual SessionLog Session { get; set; }

        public GeoPoint Location { get; set; }

        private RequestContent _request;

        [TsIgnore]
        [JsonIgnore]
        public string RequestData { get; set; }

        [NotMapped]
        public RequestContent RequestInstance
        {
            get
            {
                var type = RequestFactory.Get(this.RequestType);
                return this._request == null ?
                    (this._request = (RequestContent)this.Deserialize(RequestData, type)) :
                    this._request;
            }
            set
            {
                this.RequestData = this.Serialized(value);
                this._request = null;
            }
        }
        
        public string UserContent { get; set; }
        public string RequestContent { get; set; }

        public ServiceKind? TargetService { get; set; }
        public ServiceKind? SourceService { get; set; }
    }
}
