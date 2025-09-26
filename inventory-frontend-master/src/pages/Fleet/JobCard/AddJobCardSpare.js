import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import API from "../../../helpers/api";
import { CircleAlert, CirclePlus, Trash2 } from "lucide-react";

// const API = {
//   get: async (url) => {
//     // Simulated API call
//     return {
//       data: {
//         sparepart: [
//           { id: 1, partname: "Engine Oil", partno: "EO001", qty: 10, unitPrice: 50 },
//           { id: 2, partname: "Air Filter", partno: "AF001", qty: 5, unitPrice: 30 },
//           { id: 3, partname: "Brake Pad", partno: "BP001", qty: 8, unitPrice: 40 },
//         ],
//       },
//     }
//   },
// }

const AddJobCardSpare = ({ selectedParts, setSelectedParts, active }) => {
  const [spareParts, setSpareParts] = useState([]);
  const [hasVat, setHasVat] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [validity, setValidity] = useState(-1);

  useEffect(() => {
    loadSpare();
  }, []);

  const loadSpare = async () => {
    try {
      const res = await API.get(`/v/sparepart`);
      setSpareParts(res?.data?.sparepart);
    } catch (error) {
      console.error("Error loading spare parts:", error);
      toast.error("Failed to load spare parts");
    }
  };

  const handlePartChange = (selectedOption, index) => {
    const newParts = [...selectedParts];
    if (selectedOption) {
      newParts[index] = { ...selectedOption, qtyUsed: 1 };
    } else {
      newParts.splice(index, 1);
    }
    setSelectedParts(newParts);
  };

  const handleQtyChange = (index, value) => {
    const newParts = [...selectedParts];
    newParts[index].qtyUsed = Math.max(1, Math.min(value, newParts[index].qty));
    setSelectedParts(newParts);
  };

  const addNewPart = () => {
    setSelectedParts([...selectedParts, {}]);
  };

  const removePart = (index) => {
    setSelectedParts(selectedParts.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subTotal = selectedParts.reduce(
      (sum, part) => sum + (part.qtyUsed || 0) * (part.unitPrice || 0),
      0
    );
    const discountAmount = hasDiscount ? (subTotal * discount) / 100 : 0;
    const netTotal = subTotal - discountAmount;
    const vatAmount = hasVat ? netTotal * 0.18 : 0;
    const grossTotal = netTotal + vatAmount;

    return { subTotal, netTotal, vatAmount, grossTotal };
  };

  const qtyCheck = (total, used, index) => {
    if (total === 0 || total < used) {
      setValidity(index);
    } else {
      setValidity(-1);
    }
  };

  const { subTotal, netTotal, vatAmount, grossTotal } = calculateTotals();

  console.log("The selected parts === ------", spareParts);

  return (
    <div className="container-fluid  ">
      <div className="card bg-transparent">
        <div className="card-body">
          <h4 className="card-title mb-4">Vehicle Spare Parts</h4>
          <form>
            {/* <div className="d-flex mb-3">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hasVat"
                  checked={hasVat}
                  onChange={(e) => setHasVat(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="hasVat">
                  Has VAT
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="hasDiscount"
                  checked={hasDiscount}
                  onChange={(e) => setHasDiscount(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="hasDiscount">
                  Has Discount
                </label>
              </div>
            </div> */}
            <div className="">
              <table className="table table-striped table-sm">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "30%" }}>Spare Part Number</th>
                    <th style={{ width: "20%" }}>part Name</th>
                    <th style={{ width: "20%" }}>Qty Available</th>
                    <th style={{ width: "15%" }}>Qty Used</th>
                    <th style={{ width: "25%" }}>Unit Of Measure</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParts.map((part, index) => (
                    <tr key={index}>
                      <td>
                        <Select
                          value={part}
                          onChange={(option) => handlePartChange(option, index)}
                          options={spareParts.map((sp) => ({
                            value: sp.id,
                            label: sp.partno,
                            ...sp,
                          }))}
                          placeholder="Select the spare part"
                          isClearable
                        />
                      </td>
                      <td>{part.partname || 0}</td>
                      <td>{part.qty || 0}</td>
                      <td>
                        {part.qty === "0" ? (
                          <a
                            href="#"
                            className="link-danger d-flex align-items-center gap-2 small"
                          >
                            <CircleAlert className="small" />
                            Out of Stock
                          </a>
                        ) : (
                          <input
                            type="number"
                            className="form-control"
                            value={part.qtyUsed || ""}
                            onChange={(e) =>
                              handleQtyChange(
                                index,
                                Number.parseInt(e.target.value)
                              )
                            }
                            min={1}
                            max={part.qty}
                          />
                        )}
                      </td>
                      <td>{part.measure || "None"}</td>
                      <td>
                        <a
                          href="#"
                          className="link-danger"
                          onClick={() => removePart(index)}
                        >
                          <Trash2 />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addNewPart}
                className="btn  btn-outline-warning btn-lg mt-2"
              >
                <CirclePlus /> Add Spare Part
              </button>
            </div>
            <div className="mt-4">
              <table className="table table-sm">
                <tbody>
                  {/* <tr>
                    <td>
                      <strong>Sub Total Amount</strong>
                    </td>
                    <td className="text-end">
<NumberFormat
                        value={subTotal}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </td>
                  </tr> */}
                  {/* {hasDiscount && (
                    <tr>
                      <td>
                        <strong>Discount (%)</strong>
                      </td>
                      <td className="text-end">
                        <input
                          type="number"
                          className="form-control"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number.parseFloat(e.target.value) || 0
                                )
                              )
                            )
                          }
                        />
                      </td>
                    </tr>
                  )} */}
                  {/* <tr>
                    <td>
                      <strong>Net Total Amount</strong>
                    </td>
                    <td className="text-end">
                      <CurrencyFormat
                        value={netTotal}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </td>
                  </tr> */}
                  {/* {hasVat && (
                    <tr>
                      <td>
                        <strong>VAT (18%)</strong>
                      </td>
                      <td className="text-end">
                        <CurrencyFormat
                          value={vatAmount}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </td>
                    </tr>
                  )} */}
                  {/* <tr>
                    <td>
                      <strong>Gross Total Amount</strong>
                    </td>
                    <td className="text-end">
                      <CurrencyFormat
                        value={grossTotal}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobCardSpare;
