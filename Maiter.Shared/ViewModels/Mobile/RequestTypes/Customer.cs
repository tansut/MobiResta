using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsEnum]
    public enum Face
    {
        Happy, Sad
    }

    [TsClass]
    class CallRequestType: CustomerRequestType
    {
        public const string Name = "call";

        public CallRequestType(): base(Name)
        {
            this.Title.Values["en"] = "Call";
            this.Title.Values["tr"] = "Çağır";
            this.TargetService = Company.ServiceKind.Waiter;
            this.DisplayOrder = 100;
            this.Group = ServiceDefaults.Values[ServiceKind.Waiter].Title;
            this.Icon = "ion-android-hangout";
            this.FormatString.Values["en"] = "Can you please come?";
            this.FormatString.Values["tr"] = "Bakabilir misiniz lütfen?";
        }

    }

    [TsClass]
    class PayRequestType : CustomerRequestType
    {
        public const string Name = "pay";

        public PayRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Pay";
            this.Title.Values["tr"] = "Hesap";
            this.TargetService = Company.ServiceKind.Waiter;
            this.DisplayOrder = 101;
            this.Group = ServiceDefaults.Values[ServiceKind.Waiter].Title;
            Icon = "ion-compose";
            this.FormatString.Values["en"] = "Pay please using %(Payment)s";
            this.FormatString.Values["tr"] = "%(Payment)s ile hesap lütfen";
        }
    }



    [TsClass]
    public class FeedbackRequestType : CustomerRequestType
    {
        public const string Name = "feedback";


        public Face Status { get; set; }

        public FeedbackRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Feedback";
            this.Title.Values["tr"] = "Düşünceleriniz";
            Icon = "ion-android-contact";
        }
    }

    [TsClass]
    public class HapplyFeedbackRequestType : FeedbackRequestType
    {
        public HapplyFeedbackRequestType() : base()
        {
            this.Title.Values["en"] = "Send a Smile";
            this.Title.Values["tr"] = "Mutlu Müşteri";
            this.Status = Face.Happy;
            Icon = "ion-android-happy";
        }
    }

    [TsClass]
    public class SadFeedbackRequestType : FeedbackRequestType
    {
        public SadFeedbackRequestType() : base()
        {
            this.Title.Values["en"] = "Send a Frown";
            this.Title.Values["tr"] = "Mutsuz Müşteri";
            this.Status = Face.Sad;
            Icon = "ion-android-sad";

        }
    }

    [TsClass]
    class PrepareCarRequestType : CustomerRequestType
    {
        public const string Name = "car";

        public PrepareCarRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Prepare my car";
            this.Title.Values["tr"] = "Aracım Hazırlansın";
            this.TargetService = Company.ServiceKind.Vale;
            this.Group = ServiceDefaults.Values[ServiceKind.Vale].Title;
            this.DisplayOrder = 200;
            this.Icon = "ion-model-s";
        }
    }

    [TsClass]
    class TaxiRequestType : CustomerRequestType
    {
        public const string Name = "taxi";

        public TaxiRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Call a taxi";
            this.Title.Values["tr"] = "Taksi Lütfen";
            this.TargetService = Company.ServiceKind.Vale;
            this.Group = ServiceDefaults.Values[ServiceKind.Vale].Title;
            this.DisplayOrder = 201;
            this.Icon = "ion-android-car";
        }
    }

    
}
