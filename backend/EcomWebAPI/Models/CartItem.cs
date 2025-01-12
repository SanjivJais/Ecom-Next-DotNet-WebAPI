using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcomWebAPI.Models
{
    public class CartItem
    {
        public Guid CartItemId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Cart")]
        public Guid CartId { get; set; }

        [Required]
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Cart Cart { get; set; }
        public Product Product { get; set; }
        
    }
}
