import React from "react";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";
import ViewButtonRenderer from "../../components/customElements/Buttons";

const approvedColumnDefs = [
  { headerName: "Name", field: "name" },
  { headerName: "Mobile", field: "mobile" },
  { headerName: "Slab", field: "slab" },
  { headerName: "State", field: "state" },
  { headerName: "Win Amount", field: "winAmount" },
  { headerName: "Moderated By", field: "moderated_by" },
  { headerName: "Date", field: "date" },
  {
    field: "view",
    headerName: "View",
    cellRenderer: (params: any) => (
      <ViewButtonRenderer pageType="pendingPage" props={params} />
    ),
  },
];

const Approve: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  return (
    <>
      <GenericAgGrid
        title="Approved Overview"
        columnDefs={approvedColumnDefs}
        fetchData={API.getApproveData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="approved" shouldPlay={true} />}
      />
    </>
  );
};

export default Approve;
