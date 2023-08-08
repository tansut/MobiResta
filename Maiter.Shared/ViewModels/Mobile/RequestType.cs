using Maiter.Shared.ViewModels.Common;
using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile
{
    [TsClass]
    public class WorkerRequestType : RequestType
    {

        public WorkerRequestType(string name) : base(name)
        {


        }
    }


    [TsClass]
    public class CustomerRequestType : RequestType
    {

        public CustomerRequestType(string name) : base(name)
        {
            

        }
    }

    [TsClass]
    public abstract class RequestType
    {

        public ServiceKind TargetService { get; set; }
        public GlobalContent<string> Group { get; set; }
        public GlobalContent<string> Title { get; set; }
        public GlobalContent<string> FormatString { get; set; }

        public bool Disabled { get; set; }
        public int DisplayOrder { get; set; }
        public string Icon { get; set; }


        public string Name { get; set; }

        public RequestType(string name)
        {
            this.Name = name;
            this.Title = new Common.GlobalContent<string>();
            this.Group = new Common.GlobalContent<string>();
            this.FormatString = new Common.GlobalContent<string>();
        }
    }
}
