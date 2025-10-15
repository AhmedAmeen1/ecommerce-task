using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Category { get; set; }
        [Required]
        public string ProductCode { get; set; } // unique
        public string Name { get; set; }
        public string ImagePath { get; set; } // Local storage path for the image
        public decimal Price { get; set; }
        public int MinimumQuantity { get; set; }
        public float DiscountRate { get; set; }
    }
}
