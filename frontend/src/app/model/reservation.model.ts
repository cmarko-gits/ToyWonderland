export interface Review {
  user: string;
  rating: number;
  comment: string;
  userFullName: string;
}

export interface ReservationItem {
  toy: {
    _id: string;
    name: string;
    price: number;
    image: string;
    reviews: Review[];
  };
  quantity: number;
  price: number;
  reviewed?: boolean;
}

export interface Reservation {
  _id: string;
  status: 'reserved' | 'arrived' | 'canceled';
  total: number;
  items: ReservationItem[];
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
