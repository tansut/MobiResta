using Maiter.Core.Db;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Maiter.Core.Infrastructor;
using Maiter.Core.Web;
using Maiter.Core.Business.Account;
using System.Linq.Expressions;
using Maiter.Core.Configuration;

namespace Maiter.Core.Business
{
    public enum OrderDirection
    {
        Asc,
        Desc
    }

    public class EntityOrderInfo<T> where T : class, IEntity, new()
    {
        public OrderDirection Direction { get; set; }

        /// <summary>
        /// Kullanım Örneği : OrderBy = d => new { d.Stamp.CreatedAt }
        /// </summary>
        public Expression<Func<T, dynamic>> OrderBy { get; set; }
    }

    public class EntityBusiness<T> : EntityBusinessBase<T, string>, IEntityBusiness<T>
        where T : class, IEntity, new()
    {
        protected override string EntityKeyPropertyName
        {
            get { return "Id"; }
        }

        /// <summary>
        /// Varsayılan Order By bilgilerini tutar. Default değeri Tek bir order ile CreatedTime'a göre descending'dir. 
        /// Null değer atanırsa default order kapatılmış olur.
        /// </summary>
        public virtual List<EntityOrderInfo<T>> DefaultOrder { get; set; }

        public bool IgnoreDos
        {
            get; set;
        }

        protected IDbContext Context;

        public EntityBusiness()
            : base(ServicesConfiguration.GetService<IDbContext>(), ServicesConfiguration.GetService<IHostInfo>(), ServicesConfiguration.GetService<IClaimsBusiness>()) // property injection lazım
        {
            Context = ServicesConfiguration.GetService<IDbContext>();
            var orderInfo = this.DefaultOrder = new List<EntityOrderInfo<T>>();
            this.DefaultOrder.Add(new EntityOrderInfo<T>() { Direction = OrderDirection.Desc, OrderBy = d => new { d.Stamp.CreatedAt } });
        }

        public override bool CheckInsertSecurity(T entity)
        {
            var baseRes = base.CheckInsertSecurity(entity);
            if (baseRes && !IgnoreDos)
            {
                //var lastItem = this.Get().OrderByDescending(m => m.Stamp.CreatedAt).FirstOrDefault(p => p.Stamp.CreatedBy == ClaimsBusiness.CurrentUserId);
                //if (lastItem != null && lastItem.Stamp.CreatedAt.AddSeconds(1) > DateTime.UtcNow)
                //    return false;
            }
            return baseRes;
        }

        private IQueryable<T> SetDefaultGetOrder(IQueryable<T> retVal)
        {
            if (DefaultOrder == null)
                return retVal;

            if (DefaultOrder.Any(d => d == null))
                throw new InvalidOperationException("Default Ordering Info Item Cannot Be Set Null");

            int counter = 0;
            foreach (var orderInfo in DefaultOrder)
            {
                if (orderInfo.OrderBy != null)
                {
                    if (orderInfo.Direction == OrderDirection.Asc)
                    {
                        if (counter == 0)
                            retVal = retVal.OrderBy(orderInfo.OrderBy);
                        else
                            retVal = ((IOrderedQueryable<T>)retVal).ThenBy(orderInfo.OrderBy);
                    }
                    else if (orderInfo.Direction == OrderDirection.Desc)
                    {
                        if (counter == 0)
                            retVal = retVal.OrderByDescending(orderInfo.OrderBy);
                        else
                            retVal = ((IOrderedQueryable<T>)retVal).ThenByDescending(orderInfo.OrderBy);
                    }
                }

                counter++;
            }

            return retVal;
        }

        protected override IQueryable<T> AfterGet(IQueryable<T> result)
        {
            return SetDefaultGetOrder(result);
        }

    }
}
