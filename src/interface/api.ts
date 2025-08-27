export interface BaseResponse {
  status: number;
  message: string;
}

export interface GenericRecord {
  [key: string]:
    | string
    | number
    | boolean
    | ((props: any) => JSX.Element)
    | string[]
    | GenericRecord[];
}

export interface LoginResponse extends BaseResponse {
  data: {
    token: string;
  };
}

export interface DashboardCountResponse extends BaseResponse {
  data: GenericRecord[];
  title: string;
}

export interface GetAnyDataResponse extends BaseResponse {
  data: {
    userList: GenericRecord[];
  };
}
export interface GetUserDataResponse extends BaseResponse {
  data: GenericRecord;
}

export interface GetRejectReasonResponse extends BaseResponse {
  data: GenericRecord[];
}

// export interface SendCreateCampaignData {}

export interface LoginUserRequest {
  phone: string;
  password: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  color: string[];
  size: string[];
  images: string[];
  isFeatured: boolean;
  isTop: boolean;
  isNew: boolean;
  categoryId: string;
  inventory: number;
}

export interface ProductResponse extends BaseResponse {
  data: ProductRequest;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string[];
  size: string[];
  images: string[];
  isFeatured: boolean;
  isTop: boolean;
  isNew: boolean;
  categoryId: string;
  inventory: number;
  category: {
    id: string;
    name: string;
  };
}

export type GetProductsResponse = {
  products: GenericRecord[];
};
