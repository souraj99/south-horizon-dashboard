import "./style.scss";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/SideMenu/SideMenu";
import Header from "../../components/header/Header";

export default function DashboardLayout() {
  return (
    <div className={`dashboard-layout-wrapper`}>
      <div className={"dashboard-layout"}>
        <section className={"dashboard-layout-sidebar"}>
          <SideMenu />
        </section>
        <section className={"dashboard-layout-card"}>
          <Header />
          <Outlet />
        </section>
      </div>
    </div>
  );
}
