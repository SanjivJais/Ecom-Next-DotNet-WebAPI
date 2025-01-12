using EcomWebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcomWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartItemsController(AppDbContext context)
        {
            _context = context;
        }

        // API to get all cart items
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCartItems()
        {
            var cartItems = await _context.CartItems.ToListAsync();
            return Ok(cartItems);
        }

        // API to get a single cart item
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCartItem(Guid id)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.CartItemId == id);
            if (cartItem == null)
            {
                return NotFound();
            }
            return Ok(cartItem);
        }

        // API to add a new cart item
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddCartItem(CartItem cartItem)
        {
            if (cartItem == null)
            {
                return BadRequest();
            }
            await _context.CartItems.AddAsync(cartItem);
            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        // API to update a cart item
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCartItem(Guid id, int quantity)
        {
            if (quantity<1)
            {
                return BadRequest("Quantity must be at least one!");
            }
            var existingCartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.CartItemId == id);
            if (existingCartItem == null)
            {
                return NotFound("Category not found!");
            }
            
            existingCartItem.Quantity = quantity;
            _context.CartItems.Update(existingCartItem);
            await _context.SaveChangesAsync();
            return Ok(existingCartItem);
        }

        // API to delete/remove a cart item
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCartItem(Guid id)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.CartItemId == id);
            if (cartItem == null)
            {
                return NotFound();
            }
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }
    }
}
