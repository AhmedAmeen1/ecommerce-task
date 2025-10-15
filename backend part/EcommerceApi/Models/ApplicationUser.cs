using Microsoft.AspNetCore.Identity;
using System;

namespace EcommerceApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime LastLoginTime { get; set; }
    }
}
