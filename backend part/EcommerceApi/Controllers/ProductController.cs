using EcommerceApi.Models;
using EcommerceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace EcommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly string _imageFolderPath;

        public ProductController(IProductRepository productRepository, IWebHostEnvironment env)
        {
            _productRepository = productRepository;
            // Set local path for storing images
            _imageFolderPath = Path.Combine(env.ContentRootPath, "ProductImages");
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var products = await _productRepository.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Save image locally
            string fileName = null;
            if (model.Image != null)
            {
                fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Image.FileName);
                var filePath = Path.Combine(_imageFolderPath, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await model.Image.CopyToAsync(stream);
            }

            var product = new Product
            {
                Category = model.Category,
                ProductCode = model.ProductCode,
                Name = model.Name,
                ImagePath = fileName,
                Price = model.Price,
                MinimumQuantity = model.MinimumQuantity,
                DiscountRate = model.DiscountRate
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductCreateModel model)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            product.Category = model.Category;
            product.ProductCode = model.ProductCode;
            product.Name = model.Name;
            product.Price = model.Price;
            product.MinimumQuantity = model.MinimumQuantity;
            product.DiscountRate = model.DiscountRate;

            // If new image is uploaded, replace the old image
            if (model.Image != null)
            {
                if (!string.IsNullOrEmpty(product.ImagePath))
                {
                    var oldPath = Path.Combine(_imageFolderPath, product.ImagePath);
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                var newFileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Image.FileName);
                var newFilePath = Path.Combine(_imageFolderPath, newFileName);
                using var stream = new FileStream(newFilePath, FileMode.Create);
                await model.Image.CopyToAsync(stream);
                product.ImagePath = newFileName;
            }

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            if (!string.IsNullOrEmpty(product.ImagePath))
            {
                var imagePath = Path.Combine(_imageFolderPath, product.ImagePath);
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

            _productRepository.Delete(product);
            await _productRepository.SaveChangesAsync();

            return NoContent();
        }
    }

    public class ProductCreateModel
    {
        public string Category { get; set; }
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public IFormFile Image { get; set; }
        public decimal Price { get; set; }
        public int MinimumQuantity { get; set; }
        public float DiscountRate { get; set; }
    }
}
