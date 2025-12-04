export interface UserFormValues {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  is_admin ?:boolean
}

export interface User {
  msg: string;
  token: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  is_admin: 0|1
}