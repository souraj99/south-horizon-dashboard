import React from "react";
import Header from "../../components/header/Header";
import ViewButtonRenderer from "../../components/customElements/Buttons";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";

const campaignColumnDefs = [
  { headerName: "Name", field: "name" },
  { headerName: "Mobile", field: "mobile" },
  { headerName: "Slab", field: "slab" },
  { headerName: "State", field: "state" },
  { headerName: "Win Amount", field: "winAmount" },
  { headerName: "Moderated By", field: "moderated_by" },
  { headerName: "Reason", field: "reason" },
  { headerName: "Date", field: "date" },
  {
    field: "review",
    headerName: "Review",
    cellRenderer: (params: any) => (
      <ViewButtonRenderer pageType="rejectedPage" props={params} />
    ),
  },
];

const Rejected = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  return (
    <>
      <GenericAgGrid
        title="Rejected Overview"
        columnDefs={campaignColumnDefs}
        fetchData={API.getRejectedData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="rejected" shouldPlay={true} />}
      />
    </>
  );
};

export default Rejected;
