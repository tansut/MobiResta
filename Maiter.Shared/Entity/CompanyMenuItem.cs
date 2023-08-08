using Maiter.Shared.Attributes;
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
    public class CompanyAppMenuItem: EntityBase
    {
        [Required]
        [StringLength(22)]
        [Updatable]
        public string CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public Company Company { get; set; }

        [Updatable]
        public int DisplayOrder { get; set; }

        [Updatable]
        public bool Enabled { get; set; }

        [StringLength(64)]
        [Updatable]
        public string Title { get; set; }

        [Updatable]
        public string Content { get; set; }
    }
}
