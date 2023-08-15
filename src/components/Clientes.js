import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Clientes() {
  // const navigate = useNavigate();

  const [rowData] = useState([
    { Nombre: "Toyota", Correo: "Celica", Telefono: 35000 },
    { Nombre: "Ford", Correo: "Mondeo", Telefono: 32000 },
    { Nombre: "Porsche", Correo: "Boxster", Telefono: 72000 },
  ]);

  const [columnDefs] = useState([
    { field: "Nombre" },
    { field: "Correo" },
    { field: "Telefono" },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
        // onCellClicked={cellClickedListener}
        columnDefs={columnDefs}
      ></AgGridReact>
    </div>
  );
}
