using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Maiter.Core.Util;
using System.Data.Entity.Infrastructure;
using Maiter.Shared.Entity;
using Maiter.Core.Security;
using Maiter.Shared.Security;
using System.Data.Entity.Validation;
using Maiter.Core.Business.Account;
using System.Security;
using Maiter.Shared.Attributes;
using Maiter.Core.Infrastructor;
using System.Collections;
using Maiter.Shared.Util;
using System.Linq.Expressions;

namespace Maiter.Core.Business
{
    public enum OperationType
    {
        Insert,
        Edit,
        Delete,
        Update
    }


    public abstract class EntityBusinessBase<T, TKey> : IDisposable, IEntityBusinessBase<T, TKey>
           where T : class, IEntity, new()
    {

        private ReflectionDictionary<UpdatableAttribute> UpdatePropertyCache = new ReflectionDictionary<UpdatableAttribute>();

        protected IHostInfo Host { get; private set; }
        private DbSet<T> dbSet;
        private ExpressionBuilder<T> expressionBuilder;
        private PropertyInfo keyProperty;
        private IDbContext context { get; set; }
        protected DbSet<T> DbSet { get { return dbSet; } }
        protected IClaimsBusiness ClaimsBusiness { get; private set; }
        protected abstract string EntityKeyPropertyName { get; }

        protected EntityBusinessBase(IDbContext ctx, IHostInfo host, IClaimsBusiness claimsBusiness)
        {
            context = ctx;
            this.Host = host;
            dbSet = context.Set<T>();
            this.ClaimsBusiness = claimsBusiness;
        }

        private PropertyInfo KeyProperty
        {
            get
            {
                if (keyProperty == null)
                    keyProperty = typeof(T).GetProperty(EntityKeyPropertyName);
                return keyProperty;
            }
        }
        private ExpressionBuilder<T> ExpressionBuilder
        {
            get
            {
                if (expressionBuilder == null)
                    expressionBuilder = new ExpressionBuilder<T>();
                return expressionBuilder;
            }
        }

        public bool Exists(TKey key)
        {
            return dbSet.Any(ExpressionBuilder.EqualityExpression(key, KeyProperty.Name));
        }

        public bool Exists(Expression<Func<T, bool>> expression)
        {
            return dbSet.Any(expression);
        }

        private IQueryable<T> SetIncludes(IEnumerable<string> includes)
        {
            return SetIncludes(includes, DbSet);
        }


        private IQueryable<T> SetIncludes(IEnumerable<string> includes, DbSet<T> set)
        {

            var q = set.AsQueryable();
            return SetIncludes(includes, q);
        }


        private IQueryable<T> SetIncludes(IEnumerable<string> includes, IQueryable<T> set)
        {
            foreach (var inc in includes)
            {
                set = set.Include(inc);
            }

            return set;
        }

        private void SingleSelectBeforeReturnAction(T entity, TKey callKey)
        {
            if (entity == null)
                throw new NoResourceException("Item not found with key " + callKey);

        }

        protected virtual IQueryable<T> AfterGet(IQueryable<T> result)
        {
            return result;
        }

        public virtual IQueryable<T> Get()
        {
            var queryAble = dbSet.AsQueryable<T>();
            queryAble = AfterGet(queryAble);
            return queryAble;
        }

        public virtual IQueryable<T> Get(params string[] includes)
        {
            var queryAble = dbSet.AsQueryable<T>();
            queryAble = SetIncludes(includes, queryAble);
            queryAble = AfterGet(queryAble);
            return queryAble;
        }


        public virtual IQueryable<T> Get(Expression<Func<T, bool>> expression)
        {
            var queryAble = dbSet.Where(expression);
            queryAble = AfterGet(queryAble);
            return queryAble;
        }

        public virtual IQueryable<T> Get(Expression<Func<T, bool>> expression, params string[] includes)
        {
            var queryAble = SetIncludes(includes, DbSet);
            queryAble = queryAble.Where(expression);
            queryAble = AfterGet(queryAble);
            return queryAble;
        }

        public virtual T Id(TKey key)
        {
            var entity = dbSet.Find(key);

            SingleSelectBeforeReturnAction(entity, key);

            return entity;
        }

        public virtual T Id(TKey key, params string[] includes)
        {
            var q = dbSet.AsQueryable();
            q = SetIncludes(includes, q);
            var entity = q.FirstOrDefault(ExpressionBuilder.EqualityExpression(key, KeyProperty.Name));

            SingleSelectBeforeReturnAction(entity, key);

            return entity;
        }

        protected internal virtual void FillSecurityStamp(EntitySecurityStamp stamp, OperationType type)
        {
            if (type == OperationType.Edit)
            {
                stamp.UpdatedAt = DateTime.UtcNow;
                stamp.UpdatedBy = ClaimsBusiness.CurrentUserId;
                stamp.UpdatedByHost = this.Host.HostIP;

            }
            else
            {
                stamp.CreatedBy = ClaimsBusiness.CurrentUserId;
                stamp.CreatedAt = DateTime.UtcNow;
                stamp.CreatedByHost = this.Host.HostIP;

            }
        }

        public virtual void PrepareInsert(T entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
                entity.GenerateId();
            //else throw new Exception("Id value should be automatically set");

            FillSecurityStamp(entity.Stamp, OperationType.Insert);

            FillChildEntities(entity);

        }

        public virtual IEntityBusinessBase<T, TKey> Create(T entity)
        {
            PrepareInsert(entity);

            var security = CheckInsertSecurity(entity);

            if (!security)
                throw new SecurityException();

            dbSet.Add(entity);
            try
            {

                return this;
            }
            catch (DbEntityValidationException e)
            {

                throw;
            }

        }


        private void FillChildEntities(IEntity entity)
        {
            var ientityType = typeof(IEntity);
            var icollectionType = typeof(ICollection<>);
            List<PropertyInfo> children = new List<PropertyInfo>();
            foreach (var ch in entity.GetType().GetProperties().ToList())
            {
                if (ch.PropertyType.GetInterface(ientityType.FullName) != null)
                {
                    var child = ch.GetValue(entity) as IEntity;
                    if (child != null)
                    {
                        FillChildEntities(child);
                        if (string.IsNullOrEmpty(child.Id))
                        {
                            child.Id = IdGenerator.New;
                            FillSecurityStamp(child.Stamp, OperationType.Insert);
                        }
                    }
                }
                else if (ch.PropertyType.IsGenericType && ch.PropertyType.GetGenericTypeDefinition() == icollectionType)
                {
                    if (ch.PropertyType.GenericTypeArguments.Count() == 1 && ch.PropertyType.GenericTypeArguments.First().GetInterface(ientityType.FullName) != null)
                    {
                        var collection = ch.GetValue(entity) as ICollection;
                        if (collection == null)
                            throw new TechnicalException("Empty Collection Instances on IEntity Must Be Created On The Constructor. The type name is :" + ch.PropertyType.GenericTypeArguments.First().Name);
                        foreach (var _collectionEntity in collection.OfType<IEntity>())
                        {
                            if (string.IsNullOrEmpty(_collectionEntity.Id))
                            {
                                _collectionEntity.Id = IdGenerator.New;
                                FillSecurityStamp(_collectionEntity.Stamp, OperationType.Insert);
                            }
                            FillChildEntities(_collectionEntity);
                        }
                    }
                }

            }
        }

        public virtual bool CheckDeleteSecurity(T entity)
        {
            var userIsAdmin = ClaimsBusiness.HasRole(RoleConstants.Admin);
            var userId = ClaimsBusiness.CurrentUserId;

            if (userIsAdmin)
            {
                return true;
            }

            var entityCreated = entity.Stamp.CreatedBy;

            if (entityCreated == userId)
                return true;

            return false;
        }

        public virtual bool CheckUpdateSecurity(T entity)
        {
            var userIsAdmin = ClaimsBusiness.HasRole(RoleConstants.Admin);
            var userId = ClaimsBusiness.CurrentUserId;

            if (userIsAdmin)
            {
                return true;
            }

            var entityCreated = entity.Stamp.CreatedBy;

            if (entityCreated != userId)
                return false;

            return true;
        }

        public virtual bool CheckInsertSecurity(T entity)
        {
            if (!ClaimsBusiness.IsAuthenticated)
                return false;
            var userIsAdmin = ClaimsBusiness.HasRole(RoleConstants.Admin);

            return true;
        }


        public virtual IEntityBusinessBase<T, TKey> Update(T entity)
        {
            var security = CheckUpdateSecurity(entity);

            if (!security)
                throw new SecurityException();


            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                throw;
            }

            return this;
        }


        /// <summary>
        /// Doğrudan Database'e Raw SQL Sorgusu İçin Kullanılır.
        /// Daha Fazla Bilgi İçin <see cref="System.Data.Entity.Database.SqlQuery{TElement}(string, object[])"/>
        /// <para>
        /// Bu Methodu Kullanırken SQL Injection Ihtimaline Karşı Lütfen Aşağıdaki Gibi Bir Sorgu Yapısıyla Yazın.
        /// </para>
        /// <para>
        ///  DirectQuery&lt;QResultType&#62;("SELECT * FROM dbo.Posts WHERE Id = @p0", IdValue);
        /// </para>
        /// </summary>
        /// <typeparam name="QResultType">The type of object returned by the query.</typeparam>
        /// <param name="query">The SQL query string.</param>
        /// <param name="parameters"></param>
        public virtual DbRawSqlQuery<QResultType> DirectQuery<QResultType>(string query, params object[] parameters)
        {
            return context.Database.SqlQuery<QResultType>(query, parameters);
        }


        /// <summary>
        /// Transforms Entity In a Passive Form That Won't be included in results of the queries made by EntityBusiness interface.
        /// </summary>
        /// <param name="key">The Identifier Key.</param>
        /// <param name="removeFromStorage">If given true , removes the entity from data storage completely</param>
        public virtual IEntityBusinessBase<T, TKey> Delete(TKey key)
        {
            var entity = this.Id(key);

            var security = CheckDeleteSecurity(entity);

            if (!security)
                throw new SecurityException();
            dbSet.Remove(entity);
            return this;
        }


        private static Type[] PrimitiveTypes = new Type[] { typeof(String), typeof(DateTime) };

        private bool isPrimitive(Type propertyType)
        {
            if (propertyType.IsValueType)
                return true;
            else
            {
                return PrimitiveTypes.Any(d => propertyType.IsAssignableFrom(d));
            }
        }

        public virtual void MergeUpdate(T orig, T client)
        {
            this.mergeUpdate(orig, client);
        }

        internal void mergeUpdate(object source, object client)
        {
            var properties = UpdatePropertyCache.Get(source.GetType());
            for (int i = 0; i < properties.Count; i++)
            {
                var property = properties[i];
                var sourceValue = property.GetValue(source);
                var clientValue = property.GetValue(client);
                if (isPrimitive(property.PropertyType))
                {
                    property.SetValue(source, clientValue);
                }
                else
                {
                    if (clientValue != null && clientValue as ICollection == null)
                        mergeUpdate(sourceValue, clientValue);
                }

            }
        }

        public T CreateEmptyModel()
        {
            var t = new T();
            PrepareInsert(t);
            return t;
        }

        public void Dispose()
        {
            //context.Dispose();
        }

        public void Commit()
        {
            try
            {
                context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                throw;
            }


        }

        private Type _entityType = null;
        private Type EntityType
        {
            get
            {
                if (_entityType == null)
                {
                    _entityType = typeof(T);
                    return _entityType;
                }
                return _entityType;
            }
        }
    }
}
