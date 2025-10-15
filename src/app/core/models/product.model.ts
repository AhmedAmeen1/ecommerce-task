export interface Product {
  id?: string | number;
  category: string;
  productCode: string;
  name: string;
  imageUrl?: string;
  price: number;
  minimumQuantity: number;
  discountRate: number;
}
