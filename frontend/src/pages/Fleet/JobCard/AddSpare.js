"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

// Example spare parts data - replace with your actual data
// const SPARE_PARTS = [
//   { id: "1", name: "Engine Oil Filter" },
//   { id: "2", name: "Air Filter" },
//   { id: "3", name: "Fuel Filter" },
//   { id: "4", name: "Brake Pads" },
//   { id: "5", name: "Spark Plugs" },
// ];

export default function AddSpare({ selectedParts, setSelectedParts }) {
  const [loading, setLoading] = useState(false);
  const [SPARE_PARTS, setSpareParts] = useState([]);

  const loadSpare = async () => {
    try {
      const res = await API.get(`/v/sparepart`);
      console.log("/////...====......", res?.data?.sparepart);
      setSpareParts(res?.data?.sparepart);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePartChange = (selectedOption, index) => {
    const newParts = [...selectedParts];
    if (selectedOption) {
      newParts[index] = selectedOption;
    } else {
      newParts[index] = { value: "", label: "" };
    }
    setSelectedParts(newParts);
  };

  const addNewPart = () => {
    setSelectedParts([
      ...selectedParts,
      { value: "", label: "", unitPrice: 0 },
    ]);
  };

  const removePart = (index) => {
    const newParts = selectedParts.filter((_, i) => i !== index);
    setSelectedParts(newParts.length ? newParts : [{ value: "", label: "" }]);
  };

  // Initialize with one empty selection if there are no parts
  useEffect(() => {
    if (selectedParts.length === 0) {
      setSelectedParts([{ value: "", label: "", unitPrice: 0 }]);
    }
    loadSpare();
  }, []);
  console.log("==========++", SPARE_PARTS);
  return (
    <div className="container-fluid ">
      <form>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Add Spare Parts</h4>
            {selectedParts.map((part, index) => (
              <div key={index} className="row mb-3 align-items-center">
                <div className="col">
                  <Select
                    // value={part}
                    onChange={(option) => handlePartChange(option, index)}
                    options={SPARE_PARTS?.map((sp) => ({
                      value: sp.id,
                      label: sp.partname,
                      unitPrice: sp.unitPrice,
                      partno: sp.partno,
                    }))}
                    placeholder="Select the spare part "
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    onClick={() => removePart(index)}
                    className="btn btn-outline-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewPart}
              className="btn btn-sm btn-outline-primary"
            >
              Add Spare Part
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
