export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
    userFullName?: string;  
}

export interface Toy {
  _id: string;
  name: string;
  description: string;
  type: "puzzle" | "picture book" | "figure" | "character" | "vehicles" | "pleated" | "other";
  ageGroup: string;
  targetGroup: "devojčica" | "dečak" | "svi";
  productionDate: string;
  price: number;
  image: string;
  inStock: number;
  reviews: Review[];
  createdAt?: string;
  updatedAt?: string;
}
