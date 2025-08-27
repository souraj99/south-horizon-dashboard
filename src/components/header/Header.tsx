import "./Header.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLocation } from "react-router";

const Header = () => {
  const { pathname } = useLocation();
  const title = pathname.split("/").pop();
  console.log(title);
  const name = useSelector((state: RootState) => state.user.name);
  const role = "Admin";

  return (
    <>
      <header>
        <p className="title">{title}</p>
        <section className="user-profile">
          <div className="p-l">
            <p className="username">Hi, {name}</p>
            <p className="role">{role}</p>
          </div>
          <div className="p-r">
            <AccountCircleIcon fontSize="large" className="user-icon" />
          </div>
        </section>
      </header>
    </>
  );
};

export default Header;
