import { createBrowserRouter } from "react-router";
import { ROUTES } from "../lib/consts.ts";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.tsx";
import Login from "../pages/login/Login.tsx";
import Products from "../pages/dashboard/Products.tsx";
import PrivateRoute from "../helpers/PrivateRoute.tsx";
import Rejected from "../pages/dashboard/Rejected.tsx";
import AddProduct from "../pages/dashboard/AddProduct.tsx";
import EditProduct from "../pages/dashboard/EditProduct.tsx";
import AddCoupon from "../pages/dashboard/AddCoupon.tsx";
import EditCoupon from "../pages/dashboard/EditCoupon.tsx";
import Coupons from "../pages/dashboard/Coupons.tsx";

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.HOME_PAGE,
      element: <Login />,
    },
    {
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          path: ROUTES.PRODUCTS,
          element: <Products />,
        },
        {
          path: ROUTES.COUPON,
          element: <Coupons />,
        },
        {
          path: ROUTES.ADD_PRODUCT,
          element: <AddProduct />,
        },
        {
          path: ROUTES.EDIT_PRODUCT,
          element: <EditProduct />,
        },
        {
          path: ROUTES.ADD_COUPON,
          element: <AddCoupon />,
        },
        {
          path: ROUTES.EDIT_COUPON,
          element: <EditCoupon />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
export default router;
