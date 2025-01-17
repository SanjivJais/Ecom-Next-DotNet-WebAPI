using System.Security.Claims;
using EcomWebAPI.DTOs;
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || !Guid.TryParse(userId, out var parsedUid))
            {
                return Unauthorized(new {success = false, message = "Unauthorized user!"});
            }
            var cartItems = await _context.CartItems.Where(i=>i.Cart.UserId==parsedUid).ToListAsync();
            return Ok(new {success = true, data = cartItems});
        }

        // API to get a single cart item
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCartItem(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || !Guid.TryParse(userId, out var parsedUid))
            {
                return Unauthorized(new { success = false, message = "Unauthorized user!" });
            }
            var cartItem = await _context.CartItems
                .Where(c => c.CartItemId == id && c.Cart.UserId == parsedUid)
                .FirstOrDefaultAsync();
            if (cartItem == null)
            {
                return NotFound(new { success = false, message = "Item not found!" });
            }
            return Ok(new { success = true, data = cartItem });
        }

        // API to add a new cart item
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddCartItem(CartItemRequest cartItem)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || !Guid.TryParse(userId, out var parsedUid))
            {
                return Unauthorized(new { success = false, message = "Unauthorized user!" });
            }
            var existingCart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == parsedUid);

            if (existingCart == null)
            {
                existingCart = new Cart
                {
                    CartId = Guid.NewGuid(),
                    UserId = parsedUid,
                };
                await _context.Carts.AddAsync(existingCart);
            }

            if (cartItem == null)
            {
                return BadRequest(new { success = false, message = "Invalid input!" });
            }

            var newItem = new CartItem
            {
                CartId = existingCart.CartId,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
            };

            await _context.CartItems.AddAsync(newItem);
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data=newItem});
        }

        // API to update a cart item
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCartItem(Guid id, int quantity)
        {
            if (quantity < 1)
            {
                return BadRequest(new { success = false, message = "Quantity must be at least one!" });
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || !Guid.TryParse(userId, out var parsedUid))
            {
                return Unauthorized(new { success = false, message = "Unauthorized user!" });
            }
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.CartItemId == id && c.Cart.UserId == parsedUid);
            if (existingCartItem == null)
            {
                return NotFound(new { success = false, message = "Cart item not found!" });
            }
            existingCartItem.Quantity = quantity;
            _context.CartItems.Update(existingCartItem);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = existingCartItem });
        }

        // API to delete/remove a cart item
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCartItem(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || !Guid.TryParse(userId, out var parsedUid))
            {
                return Unauthorized(new { success = false, message = "Unauthorized user!" });
            }
            var cartItem = await _context.CartItems
                .Where(c => c.CartItemId == id && c.Cart.UserId==parsedUid)
                .FirstOrDefaultAsync();
            if (cartItem == null)
            {
                return NotFound(new {success = false, message = "Cart item not found!"});
            }
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = cartItem});
        }
    }
}
