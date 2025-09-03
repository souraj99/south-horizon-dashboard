import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  CsvExportModule,
  RowSelectionModule,
  RowSelectionOptions,
} from "ag-grid-community";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonTable from "../../components/skelitonTable/SkelitonTable";
import CustomNoRowsOverlay from "../../components/skelitonTable/CustomNoRowsOverlay";
import { store } from "../../store/store";
import { setIsRefreshed } from "../../store/slices/userSlice";
import DynamicLottie from "../../assets/lottie/DynamicLottie";
import { useNavigate } from "react-router";
import { ROUTES } from "../../lib/consts";
import API from "../../api";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  QuickFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  CsvExportModule,
  RowSelectionModule,
]);

type GenericAgGridProps = {
  title: string;
  fetchData: () => Promise<any>;
  columnDefs: any[];
  refreshStatus: boolean;

  type?: "products" | "orders" | "coupons";
};

const GenericAgGrid: React.FC<GenericAgGridProps> = ({
  title,
  fetchData,
  columnDefs,
  refreshStatus,

  type = "products",
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "92%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const navigate = useNavigate();
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 150,
    }),
    []
  );
  const onBtnExport = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);
  const fetchTableData = useCallback(() => {
    fetchData()
      .then((res) => {
        if (type === "products") {
          setRowData(res.products);
          console.log(res.products);
        } else if (type === "orders") {
          setRowData(res.data.approvedList);
        } else if (type === "coupons") {
          setRowData(res);
        }
        setLoading(false);
        store.dispatch(setIsRefreshed(false));
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [fetchData, type]);

  const onFilterTextBoxChanged = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption(
        "quickFilterText",
        (document.getElementById("filter-text-box") as HTMLInputElement).value
      );
    }
  }, []);

  const onGridReady = useCallback(() => {
    fetchTableData();
  }, [fetchTableData]);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      setSelectedRowsCount(selectedRows.length);
    }
  }, []);

  useEffect(() => {
    // console.log("refreshStatus changed:", refreshStatus);
    if (refreshStatus) fetchTableData();
  }, [refreshStatus, fetchTableData]);

  const noRowsOverlayComponentParams = useMemo(() => {
    return {
      noRowsMessageFunc: () => "No data found",
    };
  }, []);

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [10, 20, 50, 100];
  }, []);

  const gridOptions = {
    suppressServerSideFullWidthLoadingRow: true,
  };

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "One moment please..." };
  }, []);

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const handleBulkCouponDelete = () => {
    if (gridRef.current?.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      const ids = selectedRows.map((row) => row.id);
      if (ids.length > 0) {
        API.deleteBulkCoupons(ids)
          .then(() => {
            fetchTableData();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div className="grid-wrapper">
        <div className="grid-header">
          <div className="title-wrapper">
            <p className="header">{title}</p>
          </div>

          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            disabled={!rowData}
            onInput={onFilterTextBoxChanged}
          />
          {type === "products" && (
            <button
              className="add-campaign-button"
              onClick={() => navigate(ROUTES.ADD_PRODUCT)}
            >
              Add Product
            </button>
          )}
          {type === "coupons" && (
            <>
              <button
                className="add-campaign-button delete"
                onClick={handleBulkCouponDelete}
                disabled={selectedRowsCount === 0}
              >
                Delete Coupons
              </button>

              <button
                className="add-campaign-button"
                onClick={() => navigate(ROUTES.ADD_COUPON)}
              >
                Add Coupon
              </button>
            </>
          )}

          <button
            className="add-campaign-button download"
            onClick={onBtnExport}
          >
            <DynamicLottie type="download" shouldPlay />
          </button>
        </div>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={paginationPageSizeSelector}
            gridOptions={gridOptions}
            loadingOverlayComponent={SkeletonTable}
            loadingOverlayComponentParams={loadingOverlayComponentParams}
            noRowsOverlayComponent={CustomNoRowsOverlay}
            noRowsOverlayComponentParams={noRowsOverlayComponentParams}
            rowSelection={rowSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default GenericAgGrid;
