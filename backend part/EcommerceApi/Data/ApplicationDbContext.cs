using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;

namespace EcommerceApi.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.UserName)
                .IsUnique();
            builder.Entity<ApplicationUser>()
                .HasIndex(u => u.Email)
                .IsUnique();
            builder.Entity<Product>()
                .HasIndex(p => p.ProductCode)
                .IsUnique();

            builder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
