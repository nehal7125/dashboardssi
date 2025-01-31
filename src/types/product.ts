export type Product = {
  image: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  profit: number;
};

export type FEProduct = {
  id: string,
  name: string,
  type: string,
  capacity: string,
  supplier: string,
  purchaseDate: string,
  lastServiceDate: string,
}