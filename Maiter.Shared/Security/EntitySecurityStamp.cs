using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Security
{

    public class EntitySecurityStamp
    {
        /// <summary>
        /// Boş , kullanıcı adı anlık kullanıcı adına eşit olan stamp döndürür.
        /// </summary>
        public static EntitySecurityStamp Empty
        {
            get
            {
                string createdBy = "";
                var identity = Thread.CurrentPrincipal.Identity as ClaimsIdentity;
                if (identity != null)
                {
                    var identifierClaim = identity.FindFirst(ClaimTypes.NameIdentifier);
                    if (identifierClaim != null)
                        createdBy = identifierClaim.Value;
                    else
                        createdBy = identity.Name;
                }
                else
                    createdBy = Thread.CurrentPrincipal.Identity.Name;

                return new EntitySecurityStamp()
                {
                    CreatedBy = createdBy
                };
            }
        }

        /// <summary>
        /// Kaydın Kimin Tarafından Oluşturulduğunu Gösterir
        /// </summary>
        [Description("Kaydın Kimin Tarafından Oluşturulduğu Id Karşılığı")]
        [StringLength(22)]
        [Required]
        public string CreatedBy { get; set; }

        /// <summary>
        /// Kaydın Hangi Tarihte Oluşturulduğunu Gösterir.
        /// </summary>
        [Required]
        [Description("Kaydın Hangi Tarihte Oluşturulduğunu Gösterir")]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Kaydın Kimin Tarafından Update Edildiği Bilgisini Tuar
        /// </summary>
        [Description("Kaydın En Son Kimin Tarafından Update Edildiğini Gösterir Id Karşılığıdır.")]
        [StringLength(22)]
        public string UpdatedBy { get; set; }

        /// <summary>
        /// Kaydın En Son Ne Zaman Update Edildiği Bilgisini Tuar
        /// </summary>
        [Description("Kaydın En Son En Son Ne Zaman Update Edildiğini Gösterir")]
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Hangi IP Adresi Kullanılarak Oluşturulduğunu Gösterir.
        /// </summary>
        [Description("Hangi IP Adresi Kullanılarak Oluşturulduğunu Gösterir")]
        [StringLength(255)]
        public string CreatedByHost { get; set; }

        /// <summary>
        /// Hangi IP Adresi Kullanılarak En Son Güncellemenin Yapıldığını Gösterir
        /// </summary>
        [Description("Hangi IP ile En Son Güncellemenin Yapıldığını Gösterir")]
        [StringLength(255)]
        public string UpdatedByHost { get; set; }
    }
}
