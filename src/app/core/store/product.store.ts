import { Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductStore {
  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  setLoading(v: boolean) { this.loading.set(v); }
  setProducts(list: Product[]) { this.products.set(list); }
  setError(msg: string | null) { this.error.set(msg); }
}
