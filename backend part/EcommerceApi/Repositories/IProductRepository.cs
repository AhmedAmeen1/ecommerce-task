using EcommerceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcommerceApi.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> GetByIdAsync(int id);
        Task AddAsync(Product product);
        void Update(Product product);
        void Delete(Product product);
        Task SaveChangesAsync();
    }
}
