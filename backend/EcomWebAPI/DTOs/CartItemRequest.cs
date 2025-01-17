using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EcomWebAPI.DTOs
{
    public class CartItemRequest
    {
        public Guid ProductId { get; set; }

        public int Quantity { get; set; }
    }
}
