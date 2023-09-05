import { useState } from "react";

import "./App.css";
import Header from "./components/Header";
import isValidCsvLine from "./shared/isValidCsvLine";
import Swal from "sweetalert2";

interface UpdateProductInterface {
  product_code: number;
  new_price: number;
}

function App() {
  const [disabledUpdate, setDisabledUpdate] = useState<boolean>(true);
  const [csvData, setCsvData] = useState<Array<UpdateProductInterface> | null>(
    null
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        const lines = contents.split("\n").map((line) => line.split(","));
        let arrayUpdateProducts: Array<UpdateProductInterface> = [];
        const indexCsvLineProductCode = 0;
        const indexCsvLineNewPrice = 1;
        for (let index = 1; index < lines.length - 1; index++) {
          if (
            !isValidCsvLine(
              lines[index][indexCsvLineProductCode],
              lines[index][indexCsvLineNewPrice]
            )
          ) {
            Swal.fire({
              title: "Arquivo CSV inválido",
              icon: "warning",
            });
            arrayUpdateProducts = [];
            break;
          } else {
            arrayUpdateProducts.push({
              product_code: parseInt(lines[index][indexCsvLineProductCode]),
              new_price: parseFloat(lines[index][indexCsvLineNewPrice]),
            });
          }
        }
        setCsvData(arrayUpdateProducts);
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async () => {
    console.log(csvData);
  };

  const handleUpdate = async () => {};

  return (
    <>
      <Header />
      <div className="row text-center mt-2">
        <div className="col">
          <h2 style={{ fontFamily: "consolas" }}>Atualização de Preço</h2>
        </div>
      </div>
      <div className="row text-center justify-content-center mt-4">
        <div className="col-2">
          <label className="form-label">Arquivo CSV</label>
          <input
            className="form-control"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          ></input>
        </div>
        <div className="col-2">
          <button
            className="btn btn-warning"
            onClick={() => {
              handleValidate();
            }}
          >
            Validar
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-success"
            disabled={disabledUpdate}
            onClick={handleUpdate}
          >
            Atualizar
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
