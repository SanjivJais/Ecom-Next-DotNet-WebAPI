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
                return NotFound();
            }
            return Ok(new {success = true, data = category});
        }


        // Following APIs are for Admin only


        // API to add a new category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddCategory(string name, string description)
        {
            var newCategory = new Category { Name = name, Description = description };
            if (newCategory == null)
            {
                return BadRequest(new {success = false, message="Invalid input"});
            }
            if(newCategory.Name == "Uncategorized")
            {
                return BadRequest(new { success=false, message = "Cannot add \"Uncategorized\" category!" });
            }
            await _context.Categories.AddAsync(newCategory);
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = newCategory});
        }

        // API to update a category
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, string name, string description)
        {
            var updatedCategory = new Category { CategoryId=id, Name=name, Description = description };
            if (updatedCategory == null)
            {
                return BadRequest(new {success = false, message="Invalid input"});
            }
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == updatedCategory.CategoryId);
            if (existingCategory == null)
            {
                return NotFound(new {success = false, message = "Category not found!"});
            }

            if(existingCategory.Name == "Uncategorized")
            {
                return BadRequest(new { success = false, message = "Cannot update \"Uncategorized\" category!" });
            }
            existingCategory.Name = updatedCategory.Name;
            existingCategory.Description = updatedCategory.Description;
            await _context.SaveChangesAsync();
            return Ok(new {success = true, data = existingCategory});
        }

        // API to delete a category
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
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
            return Ok(new {success = true, message="Category deleted successfully!"});
        }


    }
}
