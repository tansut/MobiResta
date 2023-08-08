using Maiter.Shared.Attributes;
using Maiter.Shared.Data;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Common;
using Maiter.Shared.ViewModels.Company;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    [TsClass]
    public class Company : EntityBase, IAttachable
    {
        private ManagerResponsibility _managementService;
        private ValeResponsibility _valeService;

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [Updatable]
        [NotMapped]
        public GeoPoint Location { get; set; }
        // public Address Address { get; set; }

        public DbGeography dbLocation = null;

    [Updatable]
      
        public DbGeography DBLocation { get
            {
                return this.dbLocation;
            } set {
                this.dbLocation = value;
                if (value != null)
                {
                    this.Location.Lat = value.Latitude.GetValueOrDefault();
                    this.Location.Long = value.Longitude.GetValueOrDefault();
                }
            } }



        public virtual ICollection<CompanySection> Sections { get; set; }
        public virtual ICollection<CompanyUser> Users { get; set; }
        public virtual ICollection<CompanyAppMenuItem> AppMenuItems { get; set; }
        public virtual ICollection<CompanyCustomerRequest> DisabledCustomerRequests { get; set; }
        public virtual ICollection<CompanyMenu> MenuRelations { get; set; }

        [ForeignKey("OwnerId")]
        [TsIgnore]
        public virtual ApplicationUser Owner { get; set; }

        [Required]
        [JsonIgnore]
        public string OwnerId { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [NotMapped]
        public List<WorkItemStatus> WorkItems { get; set; }

        public const string EntityName = "Company";

        [JsonIgnore]
        [TsIgnore]
        public string ManagementServiceData { get; set; }

        [JsonIgnore]
        [TsIgnore]
        public string ValeServiceData { get; set; }

        [NotMapped]
        public ManagerResponsibility ManagementService
        {
            get
            {
                return this._managementService == null ?
                    (this._managementService = this.Deserialize<ManagerResponsibility>(ManagementServiceData)) :
                    this._managementService;
            }
            set
            {
                if (value != null)
                    value.OrderTimings();
                this.ManagementServiceData = this.Serialized(value);
                this._managementService = null;
            }
        }

        [NotMapped]
        public ValeResponsibility ValeService
        {
            get
            {
                return this._valeService == null ?
                        (this._valeService = this.Deserialize<ValeResponsibility>(ValeServiceData)) :
                        this._valeService;

            }
            set
            {
                if (value != null)
                    value.OrderTimings();
                this.ValeServiceData = this.Serialized(value);
                this._valeService = null;
            }
        }

        public Company()
        {
            this.Sections = new List<CompanySection>();
            this.Attachments = new List<EntityAttachment>();
            this.Users = new List<CompanyUser>();
            this.AppMenuItems = new List<CompanyAppMenuItem>();
            this.DisabledCustomerRequests = new List<CompanyCustomerRequest>();
            this.MenuRelations = new List<CompanyMenu>();
            this.Location = new GeoPoint();
        }

        [StringLength(255)]
        [Updatable]
        public string CountryName { get; set; }
        [StringLength(255)]
        [Updatable]
        public string StateName { get; set; }
        [StringLength(255)]
        [Updatable]
        public string CityName { get; set; }

        [ForeignKey("CityId")]
        public virtual City City { get; set; }

        [Required]
        [Updatable]
        [StringLength(22)]
        public string CityId { get; set; }

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Adress1 { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Adress2 { get; set; }

        [StringLength(10)]
        [Updatable]
        public string PostCode { get; set; }

        [StringLength(255)]
        [Updatable]
        public string TimeZone { get; set; }

        [Updatable]
        public bool Daylight { get; set; }
        
        [StringLength(256)]
        public string BarcodeID { get; set; }

        public string BarcodeContent { get; set; }

        [StringLength(16)]
        public string BarcodeVersion { get; set; }
    }

    [TsClass]
    public class CompanySection : EntityBase, IAttachable
    {
        private ManagerResponsibility _managementService;
        private List<TableResponsibility> _tableService;

        [Required]
        [StringLength(255)]
        [Updatable]
        public string Name { get; set; }

        [StringLength(255)]
        [Updatable]
        public string Desc { get; set; }

        [ForeignKey("CompanyId")]
        [TsIgnore]
        public virtual Company Company { get; set; }

        [Required]
        [StringLength(22)]
        public string CompanyId { get; set; }

        [NotMapped]
        public List<EntityAttachment> Attachments { get; set; }

        [NotMapped]
        public List<ResTable> Tables { get; set; }

        public const string EntityName = "CompanySection";

        [JsonIgnore]
        [TsIgnore]
        public string ManagementServiceData { get; set; }

        [JsonIgnore]
        [TsIgnore]
        public string TableServiceData { get; set; }

        [NotMapped]
        public ManagerResponsibility ManagementService
        {
            get
            {
                return this._managementService == null ?
                    (this._managementService = this.Deserialize<ManagerResponsibility>(ManagementServiceData)) :
                    this._managementService;
            }
            set
            {
                if (value != null)
                    value.OrderTimings();
                this.ManagementServiceData = this.Serialized(value);
                this._managementService = null;
            }
        }

        [NotMapped]
        public List<TableResponsibility> TableService
        {
            get
            {
                return this._tableService == null ?
                    (this._tableService = this.Deserialize<List<TableResponsibility>>(TableServiceData)) :
                    this._tableService;
            }
            set
            {
                if (value != null)
                    foreach (var item in value)
                    {
                        if (item != null)
                        {
                            if (string.IsNullOrEmpty(item.ResourceData.Id))
                                item.ResourceData.Id = IdGenerator.New;
                            item.OrderTimings();
                            item.ResourceData.Parsed = Util.TableSelectionParser.Parse(item.ResourceData.Expression);
                        }
                    }
                this.TableServiceData = this.Serialized(value);
                this._tableService = null;
            }
        }


        public CompanySection()
        {
            this.Attachments = new List<EntityAttachment>();
            this.Tables = new List<ResTable>();
            this.ManagementService = new ManagerResponsibility();
            this.TableService = new List<TableResponsibility>();
        }
    }
}
