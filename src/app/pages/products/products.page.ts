import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductGridOrganism } from "../../ui/organisms/product-grid/product-grid.organism";
import { ProductStore } from "../../core/store/product.store";
import { ProductService } from "../../core/services/product.service";

@Component({
  standalone: true,
  selector: "app-products-page",
  imports: [CommonModule, ProductGridOrganism],
  template: `
    <div class="container">
      <h2>Products</h2>
      <p *ngIf="store.loading()">Loading...</p>
      <p *ngIf="store.error()" style="color:#b00020">{{store.error()}}</p>
      <ui-product-grid [products]="store.products()"></ui-product-grid>
    </div>
  `
})
export class ProductsPage implements OnInit {
  store = inject(ProductStore);
  private api = inject(ProductService);

  ngOnInit() {
    this.store.setLoading(true);
    this.api.list().subscribe({
      next: list => { this.store.setProducts(list); this.store.setError(null); },
      error: () => this.store.setError("Failed to load products."),
      complete: () => this.store.setLoading(false)
    });
  }
}
