import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import notificationService from "../../../services/notificationService";
import FNSpinner from "../../../components/FNSpinner";

const AddVehicle = ({ refresh, close }) => {
  const [loading, setLoading] = useState(false);
  const [old_number_plate, setOldNumberPlate] = useState("");
  const [new_number_plate, setNewNumberPlate] = useState("");
  const [chassis_no, setChassisNo] = useState("");
  const [engine_no, setEngineNo] = useState("");
  const [power, setPower] = useState("");
  const [YOM, setYOM] = useState("");
  const [fuel, setFuel] = useState("");
  const [Type, setType] = useState("");
  const [Total_Cost, setTotalCost] = useState("");
  const [country_of_origin, setCountryOrgin] = useState("");
  const [make, setMake] = useState("");
  const [color, setColor] = useState("");
  const [model, setMode] = useState("");
  const [User_department, setUserDept] = useState("");
  const [driver, setDriver] = useState("");
  const [officer, setOfficer] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      old_number_plate,
      new_number_plate,
      chassis_no,
      engine_no,
      power,
      Type,
      YOM,
      fuel,
      make,
      color,
      model,
      Total_Cost,
      country_of_origin,
      User_department,
      driver,
      officer,
      contact,
      age,
    };

    try {
      const response = await API.post(`/v/vehicle`, data);
      setLoading(false);
      console.log("added vehicles ===>", response);
      close();
      refresh();
      toast.success("Vehicle Created Successfully !!");
      
      // Add notification for successful vehicle creation
      notificationService.addFleetNotification(
        'Vehicle Added Successfully',
        `New vehicle ${make} ${model} (${new_number_plate}) has been registered`,
        'success',
        'medium'
      );
    } catch {
      setLoading(false);
      toast.error("Error while Adding Vehicle");
      
      // Add notification for failed vehicle creation
      notificationService.addFleetNotification(
        'Vehicle Addition Failed',
        'There was an error while registering the vehicle. Please try again.',
        'error',
        'high'
      );
    }
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(100), (_, index) => currentYear - index); // Generates last 50 years

  return (
    <div class="card">
      <div class="card-body">
        <div className="row">
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Old Number Plate</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Old Number Plate"
                value={old_number_plate}
                onChange={(e) => setOldNumberPlate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">New Number Plate</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="New Number Plate"
                value={new_number_plate}
                onChange={(e) => setNewNumberPlate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Type</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Type"
                value={Type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Make</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Model</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Model"
                value={model}
                onChange={(e) => setMode(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Chassis Number</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Chassis Number"
                value={chassis_no}
                onChange={(e) => setChassisNo(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Engine Number</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Engine Number"
                value={engine_no}
                onChange={(e) => setEngineNo(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Fuel</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Fuel"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Power</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Horse Power"
                value={power}
                onChange={(e) => setPower(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="mb-3">
              <label className="form-label">Year Of Manufacture</label>
              <select
                className="form-control"
                value={YOM}
                onChange={(e) => setYOM(e.target.value)}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Purchase Cost</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Total Cost"
                value={Total_Cost}
                onChange={(e) => setTotalCost(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Color</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Country of Orgin</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Country of Origin"
                value={country_of_origin}
                onChange={(e) => setCountryOrgin(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">User Department</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="User Department"
                value={User_department}
                onChange={(e) => setUserDept(e.target.value)}
              />
            </div>
          </div>

          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Driver</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Driver Name"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Contact</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Officer</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Officer Name "
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4">
            <div class="mb-3">
              <label class="form-label">Age</label>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="div mt-3">
          <button class="btn btn-primary me-2" onClick={handleSubmit}>
            {loading ? <FNSpinner /> : "Add New Vehicle"}
          </button>
          <button class="btn btn-outline-primary" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
