import {Category} from "./Category";

export interface Product{
  id: number,
  name: string,
  category: Category,
  price: number,
  description: string,
  count: number,
  image_url: string,
  url:string;
}
