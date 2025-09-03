import "./Login.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import API from "../../api";
import { useNavigate } from "react-router";
import { ROUTES } from "../../lib/consts";
import { RootState, store } from "../../store/store";
import { setAccessToken } from "../../store/slices/authSlice";
import { showToast } from "../../lib/utils";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserDetails } from "../../store/slices/userSlice";

// Form inputs type
interface FormInputs {
  phone: string;
  password: string;
}

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  phone: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  console.log(accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
    API.loginUser(data)
      .then((resp) => {
        showToast("success", "You have been logged in successfully!");
        store.dispatch(setAccessToken(resp.token));
        store.dispatch(
          setUserDetails({
            name: resp.user.name,
            email: resp.user.email || "",
            isRefreshed: false,
            isHeaderRefresh: false,
          })
        );
        navigate(ROUTES.PRODUCTS);
      })
      .catch((err) => {
        console.log("err", err);
      });
    console.log("Form Data:", data);
  };

  useEffect(() => {
    if (accessToken) {
      navigate(ROUTES.PRODUCTS);
    }
  }, [accessToken, navigate]);

  return (
    <div className="login-container">
      <section className="login-r">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <p className="title">Login</p>
          <p className="content">Please enter your credentials to login.</p>

          <div className="form-group">
            <input
              id="phone"
              type="tel"
              maxLength={10}
              {...register("phone")}
              className={errors.phone ? "error" : ""}
              placeholder="Phone"
            />
            {errors.phone && (
              <p className="error-message">{errors.phone.message}</p>
            )}
          </div>

          <div className="form-group">
            <input
              id="password"
              type="password"
              {...register("password")}
              className={!errors.phone && errors.password ? "error" : ""}
              placeholder="Password"
            />
            {!errors.phone && errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
