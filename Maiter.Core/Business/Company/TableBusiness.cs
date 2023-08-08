using Maiter.Core.Business.Account;
using Maiter.Core.Business.Common;
using Maiter.Core.Infrastructor;
using Maiter.Core.Security;
using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using Maiter.Shared.ViewModels.Common;
using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Security;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Business
{
    public class TableBusiness : EntityBusiness<ResTable>
    {
        private CompanyBusiness companyBusiness;
        private CompanySectionBusiness sectionBusiness;


        public TableBusiness(CompanySectionBusiness sectionBusiness, CompanyBusiness companyBusiness, TagBusiness tagBusiness, AttachmentBusiness attachBusiness)
        {
            this.companyBusiness = companyBusiness;
            this.attachBusiness = attachBusiness;
            this.tagBusiness = tagBusiness;
            this.sectionBusiness = sectionBusiness;

            this.DefaultOrder.Clear();
            this.DefaultOrder.Add(new EntityOrderInfo<ResTable>() { Direction = OrderDirection.Asc, OrderBy = d => new { d.Number } });
        }

        internal ResTable BarcodeID(string id)
        {
            var entity = this.Get(p => p.BarcodeID == id, "Section", "Section.Company", "Section.Company.Users").SingleOrDefault();
            return entity;
        }



        internal ResTable GetTableFromTag(TagContent content)
        {
            var entity = this.Get(p => p.BarcodeID == content.Id, "Section", "Section.Company", "Section.Company.Users", "Section.Company.AppMenuItems",
                 "Section.Company.MenuRelations", "Section.Company.MenuRelations.Menu",
                "Section.Company.MenuRelations.Menu.Sections", "Section.Company.MenuRelations.Menu.Sections.Foods", "Section.Company.MenuRelations.Menu.Sections.Foods.FoodProperties", "Section.Company.MenuRelations.Menu.Sections.Foods.FoodProperties.FoodPropertyItems").SingleOrDefault();

            return entity;
        }

        private TagBusiness tagBusiness;
        private AttachmentBusiness attachBusiness;

        public override void MergeUpdate(ResTable orig, ResTable client)
        {
            base.MergeUpdate(orig, client);
            orig.Tags = client.Tags;
        }

        public override IEntityBusinessBase<ResTable, string> Create(ResTable entity)
        {
            var section = entity.Section == null ? sectionBusiness.Id(entity.SectionId) : entity.Section;
            if (!sectionBusiness.CheckUpdateSecurity(section))
                throw new SecurityException();
            base.Create(entity);
            var tag = TagContent.Create(TagType.Table, "1.0");
            tag.Id = IdGenerator.New;
            entity.BarcodeID = tag.Id;
            entity.BarcodeVersion = tag.Version;
            entity.BarcodeContent = tag.Serialize();


            //var newEntity = TagContent.Decrypt(entity.BarcodeID);

            return this;
        }

        private void ensureTags(ResTable entity)
        {
            if (entity.Tags != null && entity.Tags.Any())
            {
                foreach (var tag in entity.Tags)
                {
                    tag.EntityId = entity.Id;
                    tag.EntityName = ResTable.EntityName;
                }
            }
            tagBusiness.UpdateTags(entity);
        }

        public override IEntityBusinessBase<ResTable, string> Update(ResTable entity)
        {
            ensureTags(entity);
            return base.Update(entity);
        }


        protected MemberExpression GetPropertyExpression(Type t, string propertyName, Expression param)
        {
            PropertyInfo property = t.GetProperty(propertyName);
            return Expression.MakeMemberAccess(param, property); ;
        }
        public List<ResTable> ListOfTables(CompanySection entity, TableResponsibility responsibity)
        {
            var parsed = TableSelectionParser.Parse(responsibity.ResourceData.Expression);
            return ListOfTables(entity, parsed);
        }

        public List<ResTable> ListOfTables(CompanySection entity, TableExpressionParseResult parsed)
        {
            var query = this.Get().Where(p => p.SectionId == entity.Id).ToList();
            return ListOfTables(entity, parsed, query);
        }

        public List<ResTable> ListOfTables(CompanySection entity, TableExpressionParseResult parsed, List<ResTable> source)
        {
            return ListOfTablesQuery(entity, parsed, source).ToList();
        }

        public IQueryable<ResTable> ListOfTablesQuery(CompanySection entity, TableExpressionParseResult parsed, List<ResTable> source)
        {
            var query = source.AsQueryable();
            if (parsed.All)
            {

            }
            else
            {
                Expression whereExp = null;
                ParameterExpression param = Expression.Parameter(typeof(ResTable), "w");

                if (parsed.GroupNames.Count > 0)
                {
                    MemberExpression memExp = GetPropertyExpression(typeof(ResTable), "TableGroup", param);
                    LambdaExpression left = Expression.Lambda(memExp, param);
                    var right = Expression.Constant(parsed.GroupNames);
                    LambdaExpression list = Expression.Lambda(right, param);
                    Expression boolExp = Expression.Call(list.Body, "Contains", null, memExp);
                    if (whereExp == null)
                        whereExp = boolExp;
                    else whereExp = Expression.Or(whereExp, boolExp);
                }

                if (parsed.NumberList.Count > 0)
                {
                    MemberExpression memExp = GetPropertyExpression(typeof(ResTable), "Number", param);
                    LambdaExpression left = Expression.Lambda(memExp, param);
                    var right = Expression.Constant(parsed.NumberList);
                    LambdaExpression list = Expression.Lambda(right, param);
                    Expression boolExp = Expression.Call(list.Body, "Contains", null, memExp);
                    if (whereExp == null)
                        whereExp = boolExp;
                    else whereExp = Expression.Or(whereExp, boolExp);
                }


                if (parsed.Range.Count > 0)
                {
                    MemberExpression memExp = GetPropertyExpression(typeof(ResTable), "Number", param);
                    LambdaExpression left = Expression.Lambda(memExp, param);


                    Expression boolExp = null;
                    foreach (var item in parsed.Range)
                    {
                        Expression min = Expression.Constant(item.Min);
                        Expression max = Expression.Constant(item.Max);
                        Expression greater = Expression.GreaterThanOrEqual(memExp, min);
                        Expression less = Expression.LessThanOrEqual(memExp, max);

                        if (boolExp == null)
                            boolExp = Expression.And(greater, less);
                        else boolExp = Expression.Or(boolExp, Expression.And(greater, less));

                    }
                    if (whereExp == null)
                        whereExp = boolExp;
                    else whereExp = Expression.Or(whereExp, boolExp);
                }

                if (whereExp != null)
                {
                    var exp = Expression.Lambda<Func<ResTable, bool>>(whereExp, param);
                    query = query.Where(exp);
                }
            }
            return query;
        }


        public List<ResTable> Generate(TableGeneration info, bool simulate)
        {
            var result = new List<ResTable>(info.Finish - info.Start + 1);
            for (int i = info.Start; i < info.Finish + 1; i++)
            {
                var item = new ResTable()
                {
                    SectionId = info.CompanySectionId,
                    Number = i,
                    Name = string.Format("{0}{1}{2}", info.Prefix, i.ToString("D" + info.Digits), info.PostFix),
                    TableGroup = info.Group,
                    Simulated = true
                };
                item.GenerateId();
                if (info.Tags != null)
                {
                    foreach (var tag in info.Tags)
                    {
                        item.Tags.Add(new EntityTag()
                        {
                            EntityId = item.Id,
                            EntityName = ResTable.EntityName,
                            Name = tag
                        });
                    }
                }
                result.Add(item);
                if (!simulate)
                {
                    this.Create(item);
                    this.ensureTags(item);
                }
            }
            return result;
        }
    }
}
