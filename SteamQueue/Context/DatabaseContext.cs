using Microsoft.EntityFrameworkCore;
using SteamQueue.Entities;

namespace SteamQueue.Context
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Position> Positions { get; set; }
        public DbSet<Line> Lines { get; set; }
        public DbSet<SteamAccount> Accounts { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<SteamAccount>()
               .HasOne<Line>(c => c.Line)
               .WithOne(x => x.SteamAccount)
               .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<SteamAccount>()
               .HasOne<Line>(c => c.Line)
               .WithOne(x => x.SteamAccount)
               .HasForeignKey<Line>("LineId")
               .OnDelete(DeleteBehavior.SetNull);


            builder.Entity<Line>()
                .HasMany<Position>(c => c.Positions)
                .WithOne(x => x.Line)
                .OnDelete(DeleteBehavior.Cascade);
                //.WithOptional(x => x.Parent)
                //.WillCascadeOnDelete(true);

        }
    }
}
