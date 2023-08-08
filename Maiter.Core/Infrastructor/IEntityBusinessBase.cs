using Maiter.Core.Business;
using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Infrastructor
{

    public interface IEntityBusinessBase<T, TKey> : IDisposable
           where T : class, IEntity, new()
    {
        IQueryable<T> Get();
        IQueryable<T> Get(params string[] includes);
        IQueryable<T> Get(Expression<Func<T, bool>> expression);
        IQueryable<T> Get(Expression<Func<T, bool>> expression, params string[] includes);
        T Id(TKey key);
        T Id(TKey key,params string[] includes);
        bool Exists(TKey key);
        bool Exists(Expression<Func<T,bool>> expression);
        IEntityBusinessBase<T, TKey> Create(T entity);
        IEntityBusinessBase<T, TKey> Update(T entity);
        IEntityBusinessBase<T, TKey> Delete(TKey key);
        void MergeUpdate(T orig, T client);
        T CreateEmptyModel();
        bool CheckUpdateSecurity(T entity);
        bool CheckDeleteSecurity(T entity);
        bool CheckInsertSecurity(T entity);
        void Commit();

    }
}

