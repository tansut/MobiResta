using Maiter.Shared.Security;
using Maiter.Shared.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Entity
{
    [TsInterface(Module = "Kalitte")]
    public interface IEntity
    {
        string Id { get; set; }

        /// <summary>
        /// Standart Güvenlik Bilgileri. Otomatik Oluşturulacaktır.
        /// </summary>
        [TsIgnore]
        [JsonIgnore]
        [Description("Standart Güvenlik Bilgileri. Otomatik Oluşturulacaktır.")]
        EntitySecurityStamp Stamp { get; set; }

        ///// <summary>
        ///// Bir Satırın Aktif / Pasif Olma Durumun Temsil Eder. Silinen Kayıtlar Pasife Çekilecektir Silinmeyecektir
        ///// </summary>
        //[DefaultValue(true)]
        //[Description("Bir Satırın Aktif / Pasif Olma Durumun Temsil Eder. Silinen Kayıtlar Pasife Çekilecektir Silinmeyecektir")]
        //[JsonIgnore]
        //bool Active { get; set; }

        string GenerateId();
    }


    [TsClass(Module = "Kalitte")]
    public class EntityBase : IEntity
    {
        [Key]
        [StringLength(22)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public EntitySecurityStamp Stamp { get; set; }

        public string GenerateId()
        {
            return this.Id = IdGenerator.New;
        }

        protected string Serialized(object instance)
        {
            if (instance == null)
                return null;
            return JsonConvert.SerializeObject(instance, Formatting.None);
        }

        protected object Deserialize(string data, Type type)
        {
            if (string.IsNullOrEmpty(data))
                return null;
            else return JsonConvert.DeserializeObject(data, type);
        }


        protected T Deserialize<T>(string data) where T : class, new()
        {
            if (string.IsNullOrEmpty(data))
                return new T();
            else return JsonConvert.DeserializeObject<T>(data);
        }

        public EntityBase()
        {
            this.Stamp = EntitySecurityStamp.Empty;
        }


        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            if (obj.GetType() != this.GetType())
                return false;
            var entity = (EntityBase)obj;
            return entity.Id == this.Id;
        }
    }
}
