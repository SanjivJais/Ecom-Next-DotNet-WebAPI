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
            return Ok(categories);
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
            return Ok(category);
        }


        // Following APIs are for Vendor only


        // API to add a new category
        [HttpPost]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> AddCategory(Category category)
        {
            if (category == null)
            {
                return BadRequest();
            }
            if(category.Name == "Uncategorized")
            {
                return BadRequest(new { Message = "Cannot add Uncategorized category!" });
            }
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        // API to update a category
        [HttpPut("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> UpdateCategory(Guid id, Category category)
        {
            if (category == null || id != category.CategoryId)
            {
                return BadRequest();
            }
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            if(existingCategory.Name == "Uncategorized")
            {
                return BadRequest(new { Message = "Cannot update Uncategorized category!" });
            }
            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            await _context.SaveChangesAsync();
            return Ok(existingCategory);
        }

        // API to delete a category
        [HttpDelete("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
            if (category == null)
            {
                return NotFound();
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
            return Ok(new {Message="Category deleted successfully!", Id=id});
        }


    }
}
