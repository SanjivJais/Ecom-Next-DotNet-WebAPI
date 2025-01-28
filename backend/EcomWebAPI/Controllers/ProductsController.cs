using EcomWebAPI.DTOs;
using EcomWebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcomWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // API to get all products
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.Include(p=>p.Category).ToListAsync();
            return Ok(new {success = true, data = products});
        }

        // API to get a single product
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            // Use Include to load the related Category data
            var product = await _context.Products
                .Include(p => p.Category) // Explicitly load the Category
                .FirstOrDefaultAsync(p => p.ProductId == id);

            // Or use DTO to only fetch required data
            /*
             * var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ProductId == id)
                .Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    Category = new { p.Category.Name, p.Category.Description }
                })
                .FirstOrDefaultAsync();
             */

            if (product == null)
            {
                return NotFound(new {success = false, message= "Product not found!"});
            }
            return Ok(new {success = true, data = product});
        }


        // Following APIs are for Vendor only

        // API to add a new product
        [HttpPost]
        [Authorize(Roles= "Vendor")]
        public async Task<IActionResult> AddProduct(ProductRequest request)
        {
            if (request == null)
            {
                return BadRequest(new {success = false, message = "Invalid input!"});
            }
            var product = new Product
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                Stock = request.Stock,
                ImageUrl = request.ImageUrl,
            };
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return Ok(new {success = true, data= product });
        }


        // API to update a product
        [HttpPut("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> UpdateProduct(Guid id, ProductRequest request)
        {
            var updatedProduct = new Product { ProductId = id };
            if(updatedProduct == null || id != updatedProduct.ProductId)
            {
                return BadRequest(new {success = false, message = "Invalid input!"});
            }
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);
            if (existingProduct == null)
            {
                return NotFound(new {success = false, message = "Product not found!"});
            }
            existingProduct.Name = request.Name;
            existingProduct.Description = request.Description;
            existingProduct.Price = request.Price;
            existingProduct.Stock = request.Stock;
            existingProduct.ImageUrl = request.ImageUrl;
            existingProduct.CategoryId = request.CategoryId;
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = existingProduct});
        }


        // API to delete a product
        [HttpDelete("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound(new {success = false, message = "Product not found!" });
            }
            product.IsDeleted = true;

            var cartItems = await _context.CartItems.Where(i=>i.ProductId == id).ToListAsync();
            foreach (var item in cartItems)
            {
                item.IsDeleted = true;
            }
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = product});
        }


    }
}
