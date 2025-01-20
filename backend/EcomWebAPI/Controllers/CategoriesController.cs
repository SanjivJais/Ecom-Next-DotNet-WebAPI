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
    public class CategoriesController : ControllerBase
    {

        private readonly AppDbContext _context;
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // API to get all categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(new {success = true, data = categories});
        }

        // API to get a single category
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
            if (category == null)
            {
                return NotFound(new {success = false, message = "Category not found!"});
            }
            return Ok(new {success = true, data = category});
        }


        // Following APIs are for Admin only


        // API to add a new category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddCategory([FromBody] CategoryRequest categoryRequest)
        {
            if (categoryRequest == null || string.IsNullOrWhiteSpace(categoryRequest.Name))
            {
                return BadRequest(new { success = false, message = "Invalid input!" });
            }
            if (categoryRequest.Name == "Uncategorized")
            {
                var existingUncategorized = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Uncategorized");
                if(existingUncategorized != null)
                {
                    return BadRequest(new { success = false, message = "Cannot add \"Uncategorized\" category!" });
                }
            }
            var newCategory = new Category 
            { 
                Name = categoryRequest.Name, 
                Description = categoryRequest.Description, 
            };
            await _context.Categories.AddAsync(newCategory);
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = newCategory});
        }

        // API to update a category
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory([FromRoute] Guid id, CategoryRequest catRequest)
        {
            if (catRequest == null || string.IsNullOrWhiteSpace(catRequest.Name))
            {
                return BadRequest(new { success = false, message = "Invalid input!" });
            }
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
            if (existingCategory == null)
            {
                return NotFound(new {success = false, message = "Category not found!"});
            }

            if(existingCategory.Name == "Uncategorized")
            {
                return BadRequest(new { success = false, message = "Cannot update \"Uncategorized\" category!" });
            }
            
            existingCategory.Name = catRequest.Name;
            if (catRequest.Description != null)
            {
                existingCategory.Description = catRequest.Description;
            }
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = existingCategory});
        }

        // API to delete a category
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory([FromRoute] Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
            if (category == null)
            {
                return NotFound(new {success = false, message = "Category not found!"});
            }
            category.IsDeleted = true;

            // Also mark all products under this category as Uncategorized
            var uncategorized = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Uncategorized");
            if(uncategorized == null)
            {
                uncategorized = new Category { Name = "Uncategorized" };
                await _context.Categories.AddAsync(uncategorized);
                await _context.SaveChangesAsync();
            }
            var products = await _context.Products.Where(p => p.CategoryId == id).ToListAsync();
            foreach (var product in products)
            {
                product.CategoryId = uncategorized.CategoryId;
            }

            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = category});
        }


    }
}
