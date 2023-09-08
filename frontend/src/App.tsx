import { useState } from "react";

import "./App.css";
import Header from "./components/Header";
import isValidCsvLine from "./shared/isValidCsvLine";
import Swal from "sweetalert2";
import axios from "axios";

import { MdWarning } from "react-icons/md";
import { BiSolidErrorCircle } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";

const apiUrl = "http://localhost:8080";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

interface UpdateProductInterface {
  code: number;
  sales_price: number;
}

function App() {
  const [disabledUpdate, setDisabledUpdate] = useState<boolean>(true);
  const [csvData, setCsvData] = useState<Array<UpdateProductInterface> | null>(
    null
  );
  const [products, setProducts] = useState<Array<any>>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        const lines = contents.split("\n").map((line) => line.split(","));
        let arrayUpdateProducts: Array<UpdateProductInterface> = [];
        const indexCsvLineProductCode = 0;
        const indexCsvLineNewPrice = 1;
        for (let index = 1; index < lines.length; index++) {
          if (index == lines.length - 1 && lines[index].length == 1) {
            break;
          }
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
              code: parseInt(lines[index][indexCsvLineProductCode]),
              sales_price: parseFloat(lines[index][indexCsvLineNewPrice]),
            });
          }
        }
        let arrayTmp: any = [];
        arrayUpdateProducts.forEach((product: any) => {
          arrayTmp.push({
            code: product.code,
            sales_price: product.sales_price,
            validation: 0,
          });
        });
        setCsvData(arrayUpdateProducts);
        setProducts(arrayTmp);
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async () => {
    if (csvData == null || csvData.length <= 0) {
      return Swal.fire({
        text: "Arquivo CSV inválido",
        icon: "warning",
      });
    }
    const options = {
      url: `${apiUrl}/api/products/validate`,
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      data: {
        products: csvData,
      },
    };
    await axios
      .request(options)
      .then((response: any) => {
        if (response.data.valid) {
          setDisabledUpdate(false);
        }

        setProducts(response.data.products);
      })
      .catch((error: any) => {
        Swal.fire({
          text: error.response.data.error || "Falha ao verificar produtos",
          icon: "warning",
        });
      });
  };

  const handleUpdate = async () => {
    const options = {
      url: `${apiUrl}/api/products/update`,
      method: "PUT",
      headers: {
        ContentType: "application/json",
      },
      data: {
        products: csvData,
      },
    };

    await axios
      .request(options)
      .then((response: any) => {
        Swal.fire({
          text: response.data.success,
          icon: "success",
        });
        setDisabledUpdate(true);
        setCsvData([]);
        setProducts([]);
      })
      .catch((error: any) => {
        Swal.fire({
          text: error.response.data.error || "Falha ao atualizar produtos",
          icon: "warning",
        });
      });
  };

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

      <div className="row text-center mt-3 justify-content-center">
        <div className="col-6">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Código Produto</th>
                <th>Novo Preço</th>
                <th>Validação</th>
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 &&
                products?.map((product, index) => {
                  return (
                    <tr key={index}>
                      <td>{product.code}</td>
                      <td>{product.sales_price}</td>
                      <td>
                        {product.validation == 0 && (
                          <button className="button-advice">
                            <MdWarning color={"#FFBF00"} size={25} />
                          </button>
                        )}
                        {product.validation.error && (
                          <OverlayTrigger
                            placement={"top"}
                            overlay={
                              <Tooltip>{product.validation.error}</Tooltip>
                            }
                          >
                            <button className="button-advice">
                              <BiSolidErrorCircle color={"#FF0000"} size={25} />{" "}
                            </button>
                          </OverlayTrigger>
                        )}
                        {product.validation.success && (
                          <button className="button-advice">
                            <AiFillCheckCircle color={"#93c47d"} size={25} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
