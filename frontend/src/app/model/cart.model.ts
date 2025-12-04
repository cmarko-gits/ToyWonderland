import { Toy } from "./toy.model";

export interface CartItem {
  toyId: Toy;
  quantity: number;
  priceAtTheMoment: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
}