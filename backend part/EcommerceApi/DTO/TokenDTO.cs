using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.DTO
{
    public class TokenDTO
    {
        [Required]
        public string AccessToken { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}
