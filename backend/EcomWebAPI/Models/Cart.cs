using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcomWebAPI.Models
{
    public class Cart
    {
        public Guid CartId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        [Required]
        public User User { get; set; }
    }
}
