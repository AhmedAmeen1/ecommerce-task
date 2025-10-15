import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Product } from "../../../core/models/product.model";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "ui-product-tile",
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="card">
    <img class="product" [src]="resolveImage(product)" [alt]="product.name">
    <h3>{{product.name}}</h3>
    <small class="muted">{{product.category}} Â· {{product.productCode}}</small>
    <p><strong>{{product.price | currency}}</strong> <small class="muted" *ngIf="product.discountRate">-{{product.discountRate}}%</small></p>
    <p><small>Min qty: {{product.minimumQuantity}}</small></p>
  </div>
  `
})
export class ProductTileMolecule {
  @Input({ required: true }) product!: Product;
  resolveImage(p: Product) {
    if (!p.imageUrl) return "assets/placeholder.jpg";
    if (p.imageUrl.startsWith("http")) return p.imageUrl;
    return `${environment.imageBaseUrl}${p.imageUrl.startsWith("/") ? "" : "/"}${p.imageUrl}`;
  }
}
