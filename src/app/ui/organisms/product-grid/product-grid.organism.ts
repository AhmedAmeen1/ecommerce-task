import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Product } from "../../../core/models/product.model";
import { ProductTileMolecule } from "../../molecules/product-tile/product-tile.molecule";

@Component({
  selector: "ui-product-grid",
  standalone: true,
  imports: [CommonModule, ProductTileMolecule],
  template: `
    <div class="grid">
      <ui-product-tile *ngFor="let p of products" [product]="p"></ui-product-tile>
    </div>
  `
})
export class ProductGridOrganism {
  @Input() products: Product[] = [];
}
