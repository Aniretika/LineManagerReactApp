using SteamQueue.Context;
using Microsoft.EntityFrameworkCore;
using SteamQueue.Entities;

namespace SteamQueue.Services.DatabaseInitialization
{
    public class DbInitializer : IDbInitializer
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly DateTime currentDate = DateTime.Now.Date;
        public DbInitializer(IServiceScopeFactory scopeFactory)
        {
            this._scopeFactory = scopeFactory;
        }

        public void Initialize()
        {
            using (var serviceScope = _scopeFactory.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DatabaseContext>())
                {
                    context!.Database.Migrate();
                }
            }
        }


        public void SeedData()
        {
            using (var serviceScope = _scopeFactory.CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DatabaseContext>())
                {
                    SteamAccount steamAccountLine1 = new() 
                    { 
                        Login = "AwesomeLogin!", 
                        Password = "ComplicatedPassword!", 
                        Id = new Guid("b12b4e1d-f7b6-428e-8967-f25b89320bfe"),
                        LineId = new Guid("aff9f7f2-84ca-4d22-8d86-a14a1821c89c")
                    };

                    /* Queue Section */
                    var lines = new List<Line>
                    {
                        new Line
                        {
                            Id = new Guid("aff9f7f2-84ca-4d22-8d86-a14a1821c89c"),
                            LineName = "Steam Line 1",
                            PositionPeriod = 72000000000,
                            LineStart = DateTimeOffset.Now + new TimeSpan(10, 0, 0),
                            LineFinish = DateTimeOffset.Now + new TimeSpan(23, 0, 0),
                            SteamAccount = steamAccountLine1,
                            LineType = "timeslot"
                        }
                    };
                    steamAccountLine1.Line = lines[0];

                    var accounts = new List<SteamAccount>
                    {
                        new SteamAccount
                        {
                            Login = "AnotherSteamAccount", 
                            Password = "Pa$$w0rd!", 
                            Id = new Guid("3d67f6f2-4f12-4082-a97c-68a01c3b8d43"),
                            Line = null
                        },
                        new SteamAccount
                        {
                            Login = "GroupAccount", 
                            Password = "HI_0hdocz777", 
                            Id = new Guid("2a9322e3-8dba-49cd-96fc-5f3c253a9b1a"),
                            Line = null
                        },
                        new SteamAccount
                        {
                            Login = "NewAccount", 
                            Password = "NewAccount_pa$$w0rd", 
                            Id = new Guid("92ef2489-174e-403a-bca7-310b12591c6b"),
                            Line = null
                        },
                        new SteamAccount
                        {
                            Login = "Account", 
                            Password = "Pa$$w0rdAccount", 
                            Id = new Guid("6784dbf9-bf54-4c69-b4a7-0d536531ad47"),
                            Line = null
                        }

                        
                    };
                    if (!context!.Lines!.Any())
                    {
                        context.AddRange(accounts);
                        context.AddRange(lines);
                        context!.SaveChanges();

                    }
                }
            }
        }
    }
}
