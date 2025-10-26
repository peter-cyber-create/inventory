import { useEffect, useState } from "react";
import API from "../../../helpers/api";
import Select from "react-select";

function EditSpare({ selectedParts, setSelectedParts, refresh }) {
  const [loading, setLoading] = useState(false);
  const [SPARE_PARTS, setSpareParts] = useState([]);

  const loadSpare = async () => {
    try {
      const res = await API.get(`/v/sparepart`);
      console.log("...", res?.data?.sparepart);
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

  const deleteJobCardSpare = async (Id) => {
    try {
      const res = await API.delete(`/jobcard/spare/${Id}`);
      refresh();
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {
    loadSpare();
  }, []);

  console.log("spare====", selectedParts);
  return (
    <div className="container mt-5">
      {/* <pre className="mt-4 p-3 bg-light rounded">
        {JSON.stringify(selectedParts, null, 2)}
      </pre> */}

      <form>
        <div className="car">
          <div className="">
            <h4 className="card-title mb-4">Add Spare Parts</h4>
            {selectedParts.map((part, index) => (
              <div key={index} className="row mb-3 ">
                <div className="col">
                  <Select
                    // value={part}
                    defaultValue={part?.value}
                    onChange={(option) => handlePartChange(option, index)}
                    options={SPARE_PARTS?.map((sp) => ({
                      value: sp.id,
                      label: sp.partno,
                      unitPrice: sp.unitPrice,
                    }))}
                    placeholder={part?.label}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    onClick={() => deleteJobCardSpare(part?.key)}
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

export default EditSpare;
