// Enable-Migrations  -ProjectName Maiter.Core -StartupProjectName Maiter.Web.UI -Verbose
// Add-Migration -ProjectName Maiter.Core -StartupProjectName Maiter.Web.UI -Verbose
// Update-Database -ProjectName Maiter.Core -StartupProjectName Maiter.Web.UI -Verbose


using Maiter.Shared.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Owin;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;
using Maiter.Core.Infrastructor;
using System.Data.Entity.Infrastructure.Annotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Maiter.Core.Db
{

    /// <summary>
    /// Application Entity Context. To Get The Instance of the context you should use.
    /// <para>
    /// <see cref="System.Web.HttpContext.Current"/>.GetOwinContext().Get&lt;<see cref="DbCtx"/>&#62;();
    /// </para> 
    /// !!!Do Not Dispose this object until you finished all your operations!!!
    /// This Object will be transferred over all the business instances.
    /// </summary>
    public class DbCtx : IdentityDbContext<ApplicationUser, IdentityRole, string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>, IDbContext
    {
        #region Security
        public DbSet<Client> Clients { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        #endregion

        public DbSet<Company> Company { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<CountryState> CountryState { get; set; }
        public DbSet<Menu> Menu { get; set; }
        public DbSet<MenuSection> MenuSection { get; set; }
        public DbSet<EntityAttachment> Attachment { get; set; }
        public DbSet<EntityTag> Tag { get; set; }
        public DbSet<Food> Food { get; set; }
        public DbSet<CompanyMenu> RestaurantMenu { get; set; }
        public DbSet<FoodProperty> FoodProperty { get; set; }
        public DbSet<FoodPropertyItem> FoodPropertyItem { get; set; }
        public DbSet<CompanyAppMenuItem> CompanyManuItem { get; set; }

        //public DbSet<SessionLog> UserSession { get; set; }
        public DbSet<RequestLog> Request { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<EntityAttachment>()
                .Property(t => t.EntityName)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_EntityNameId", 1) { }));

            modelBuilder
                .Entity<EntityAttachment>()
                .Property(t => t.EntityId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_EntityNameId", 2) { }));

            modelBuilder
                .Entity<CompanyMenu>()
                .Property(t => t.CompanyId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestaurantId", 1) { IsUnique=true }));

            modelBuilder
                .Entity<CompanyMenu>()
                .Property(t => t.MenuId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestaurantId", 2) { IsUnique = true }));

            modelBuilder
                .Entity<ResTable>()
                .Property(t => t.BarcodeID)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestTableBarcodeId", 1) { IsUnique = true }));

            modelBuilder
                .Entity<ResTable>()
                .Property(t => t.SectionId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestTableNameId", 1) { IsUnique = true }));

            modelBuilder
                .Entity<ResTable>()
                .Property(t => t.Name)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestTableNameId", 2) { IsUnique = true }));

            modelBuilder
                .Entity<ResTable>()
                .Property(t => t.SectionId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestTableNumberId", 1) { IsUnique = true }));

            modelBuilder
                .Entity<ResTable>()
                .Property(t => t.Number)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_RestTableNumberId", 2) { IsUnique = true }));

            modelBuilder
                .Entity <CompanyUser>()
                .Property(t => t.CompanyId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_CompanyUserId", 1) { IsUnique = true }));

            modelBuilder
                .Entity<CompanyUser>()
                .Property(t => t.UserId)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(
                        new IndexAttribute("IX_CompanyUserId", 2) { IsUnique = true }));

            modelBuilder
                .Entity<CompanyUser>()
                .HasRequired(d => d.User)
                .WithMany()
                .WillCascadeOnDelete(false);  // hem aspnetusers hem company ile ilişkilş olduğu için hangisi silinince cascade yapacağını bilemiyor

            modelBuilder
              .Entity<Company>()
              .HasRequired(d => d.City).WithMany()
              .WillCascadeOnDelete(false);

            base.OnModelCreating(modelBuilder);
        }

        public static DbCtx Create()
        {
            return new DbCtx();
        }

        public DbCtx() : base("SqlConStr")
        {            
            Configuration.LazyLoadingEnabled = false;
        }

        /// <summary>
        /// Creates New Entity Context Explicitly For a new Instance instead of the context carried by the OwinContext.
        /// </summary>
        /// <param name="createNewContext"></param>
        public DbCtx(bool createNewContext) : this()
        {
            if (!createNewContext)
                throw new InvalidOperationException("If New Context Haven't been specified explicitly, you should use OwinContext.Get<DbCtx>() method to get the active context");
        }


        /// <summary>
        /// Do not dispose until Request have successfully finished.
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }
    }
}
