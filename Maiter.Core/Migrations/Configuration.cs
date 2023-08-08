namespace Maiter.Core.Migrations
{
    using Maiter.Core.Business.Account;
    using Maiter.Core.Security;
    using Maiter.Core.Util;
    using Maiter.Shared.Util;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Maiter.Core.Db.DbCtx>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;

        }

        protected override void Seed(Maiter.Core.Db.DbCtx context)
        {
            //  This method will be called after migrating to the latest version.

            context.Clients.AddOrUpdate(new Shared.Entity.Client()
            {
                Active = true,
                AllowedOrigin = "*",
                ApplicationType = Shared.Entity.ApplicationTypes.JavaScript,
                Id = Helper.GetHash("theClientId"),
                Name = "TestClient",
                RefreshTokenLifeTime = 43200,
                Secret = Helper.GetHash("testClientSectet")
            });


            context.Clients.AddOrUpdate(new Shared.Entity.Client()
            {
                Active = true,
                AllowedOrigin = "*",
                ApplicationType = Shared.Entity.ApplicationTypes.JavaScript,
                Id = Helper.GetHash("defaultSlidingExprationClient"),
                Name = "defaultSlidingExprationClient",
                RefreshTokenLifeTime = 60,
                Secret = Helper.GetHash("defaultSlidingExprationClientSecret")
            });


            context.Users.AddOrUpdate(new Shared.Entity.ApplicationUser()
            {
                AccessFailedCount = 0,
                Active = false,
                Email = "system@maiter.com",
                Name = "Anonymous User",
                Surname = "Anonymous User",
                EmailConfirmed = false,
                Id = ClaimsBusiness.AnonymousSystemUserId,
                Stamp = new Shared.Security.EntitySecurityStamp() { CreatedAt = DateTime.UtcNow, CreatedBy = "systemAnonUser", CreatedByHost = HostInfo.NoIp },
                UserName = "system@maiter.com"
            });

            context.SaveChanges();
        }
    }
}
