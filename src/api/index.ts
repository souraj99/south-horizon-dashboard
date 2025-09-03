/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AuthResponse,
  BaseResponse,
  CouponRequest,
  CouponResponse,
  DashboardCountResponse,
  GenericRecord,
  GetAnyDataResponse,
  GetProductsResponse,
  GetRejectReasonResponse,
  GetUserDataResponse,
  LoginResponse,
  LoginUserRequest,
  ProductRequest,
} from "../interface/api";
import { authorizedApiCall, unauthorizedApiCall } from "./apiClient";

import {
  authorisedApiCall,
  defaultCatch,
  fetchHandler,
  responseHelper,
  unauthorisedApiCall,
} from "./utils";

class APIS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private showLoader = (loaderTitle?: string | undefined) => {};
  private hideLoader = (loaderTitle?: string | undefined) => {};
  private static instance: APIS | null = null;
  public instanceId = "SH-API-1";

  constructor(instanceId: string) {
    this.instanceId = instanceId;
  }

  static getInstance() {
    return APIS.instance || (APIS.instance = new APIS("SH-API-1 NEW 1"));
  }

  initialize(
    showLoader: (loaderTitle?: string | undefined) => void,
    hideLoader: () => void
  ) {
    this.showLoader = showLoader;
    this.hideLoader = hideLoader;
  }

  loginUser(data: LoginUserRequest): Promise<AuthResponse> {
    return unauthorizedApiCall("/admin/login", data, "POST", {
      success: "Login successful!",
      error: "Invalid email or password.",
    });
  }

  getAllCategories(): Promise<GetProductsResponse> {
    return authorizedApiCall("/api/categories", undefined, "GET", {
      success: "Categories fetched successfully!",
      error: "Failed to fetch categories.",
    });
  }
  getAllProducts(): Promise<GetProductsResponse> {
    return authorizedApiCall("/api/products", undefined, "GET", {
      success: "Products fetched successfully!",
      error: "Failed to fetch products.",
    });
  }
  addProducts(data: ProductRequest): Promise<BaseResponse> {
    return authorizedApiCall("/api/products", data, "POST", {
      success: "Product added successfully!",
      error: "Failed to add product.",
    });
  }
  updateProducts(data: ProductRequest, id: string): Promise<BaseResponse> {
    return authorizedApiCall(`/api/products/${id}`, data, "PUT", {
      success: "Product updated successfully!",
      error: "Failed to update product.",
    });
  }

  deleteProduct(id: string): Promise<BaseResponse> {
    return authorizedApiCall(`/api/products/${id}`, {}, "DELETE", {
      success: "Product deleted successfully!",
      error: "Failed to delete product.",
    });
  }

  getAllCoupons(): Promise<GenericRecord[]> {
    return authorizedApiCall("/api/coupons", undefined, "GET", {
      success: "Coupons fetched successfully!",
      error: "Failed to fetch coupons.",
    });
  }

  getCoupon(id: string): Promise<CouponResponse> {
    return authorizedApiCall(`/api/coupons/${id}`, undefined, "GET", {
      success: "Coupon fetched successfully!",
      error: "Failed to fetch coupon.",
    });
  }
  toggleCoupon(id: string): Promise<CouponResponse> {
    return authorizedApiCall(`/api/coupons/${id}/toggle`, undefined, "PATCH", {
      success: "Coupon toggled successfully!",
      error: "Failed to toggle coupon.",
    });
  }

  updateCoupon(id: string, data: CouponRequest): Promise<CouponResponse> {
    return authorizedApiCall(`/api/coupons/${id}`, data, "PUT", {
      success: "Coupon updated successfully!",
      error: "Failed to update coupon.",
    });
  }
  addCoupon(data: CouponRequest): Promise<CouponResponse> {
    return authorizedApiCall("/api/coupons", data, "POST", {
      success: "Coupon added successfully!",
      error: "Failed to add coupon.",
    });
  }
  deleteCoupon(id: string): Promise<BaseResponse> {
    return authorizedApiCall(`/api/coupons/${id}`, {}, "DELETE", {
      success: "Coupon deleted successfully!",
      error: "Failed to delete coupon.",
    });
  }
  deleteBulkCoupons(ids: string[]): Promise<CouponResponse> {
    return authorizedApiCall(`/api/coupons/bulk/delete`, { ids }, "DELETE", {
      success: "Coupons deleted successfully!",
      error: "Failed to delete coupons.",
    });
  }

  async logout(): Promise<BaseResponse> {
    this.showLoader("Logout...");
    return authorisedApiCall("/admin/logout", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }

  async getApproveData(): Promise<GetAnyDataResponse> {
    return authorisedApiCall("/admin/getApprovedUsers", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
  async getRejectedData(): Promise<GetAnyDataResponse> {
    return authorisedApiCall("/admin/getRejectedUsers", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async getUserData(userId: string): Promise<GetUserDataResponse> {
    return authorisedApiCall(`/admin/getUserInfo/${userId}`, {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async getRejectReasonData(): Promise<GetRejectReasonResponse> {
    return authorisedApiCall("/admin/rejectReason", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
  async getApproveReasonData(): Promise<GetRejectReasonResponse> {
    return authorisedApiCall("/admin/approveReason", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async userAction(
    endpoint: "review" | "reject" | "approve",
    userId: number,
    payload: Record<string, any> = {}
  ): Promise<BaseResponse> {
    const finalPayload = {
      userId,
      ...payload,
    };

    return authorisedApiCall(`/admin/${endpoint}`, finalPayload)
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
}
const API = APIS.getInstance();

export default API;
