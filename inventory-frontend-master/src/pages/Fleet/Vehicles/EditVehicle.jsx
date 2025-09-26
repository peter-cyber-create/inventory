import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const EditVechile = ({ id, close, refresh }) => {
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

  const [types, setTypes] = useState([]);
  const [makes, setMakes] = useState([]);

  const vehicleDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle/${id}`);
      const vehicle = res.data.vehicle;

      setOldNumberPlate(vehicle.old_number_plate || "");
      setNewNumberPlate(vehicle.new_number_plate || "");
      setType(vehicle.type || "");
      setMake(vehicle.make || "");
      setChassisNo(vehicle.chassis_no || "");
      setEngineNo(vehicle.engine_no || "");
      setYOM(vehicle.YOM || "");
      setFuel(vehicle.fuel || "");
      setPower(vehicle.power || "");
      setTotalCost(vehicle.total_cost || "");
      setCountryOrgin(vehicle.country_of_origin || "");
      setColor(vehicle.color || "");
      setMode(vehicle.model || "");
      setUserDept(vehicle.User_department || "");
      setDriver(vehicle.driver || "");
      setContact(vehicle.contact || "");
      setOfficer(vehicle.officer || "");
      setAge(vehicle.age || "");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch vehicle details.");
    }
  };

  const loadTypes = async () => {
    try {
      const res = await API.get("/v/type");
      setTypes(res?.data.types || []);
    } catch (error) {
      toast.error("Failed to fetch types.");
    }
  };

  const loadMakes = async () => {
    try {
      const res = await API.get("/v/make");
      setMakes(res?.data.makes || []);
    } catch (error) {
      toast.error("Failed to fetch makes.");
    }
  };

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
      await API.patch(`/v/vehicle/${id}`, data);
      toast.success("Vehicle updated successfully!");
      close();
      refresh();
    } catch (error) {
      toast.error("Failed to update vehicle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    vehicleDetails();
    loadTypes();
    loadMakes();
  }, []);

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
        <div className="d-flex justify-content-end mt-3">
          <button type="submit" onClick={handleSubmit} className="btn btn-primary me-2">
            {loading ? <FNSpinner /> : "Update Vehicle"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    // <div className="card">
    //   <div className="card-body">
    //     <form onSubmit={handleSubmit}>
    //       <div className="row">
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Old Number Plate</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={oldNumberPlate}
    //               onChange={(e) => setOldNumberPlate(e.target.value)}
    //               placeholder="Enter old number plate"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">New Number Plate</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={newNumberPlate}
    //               onChange={(e) => setNewNumberPlate(e.target.value)}
    //               placeholder="Enter new number plate"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Type</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={type}
    //               onChange={(e) => setType(e.target.value)}
    //               placeholder="Enter fuel type"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Make</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={make}
    //               onChange={(e) => setMake(e.target.value)}
    //               placeholder="Enter fuel type"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Chassis Number</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={chassisNo}
    //               onChange={(e) => setChassisNo(e.target.value)}
    //               placeholder="Enter chassis number"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Engine Number</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={engineNo}
    //               onChange={(e) => setEngineNo(e.target.value)}
    //               placeholder="Enter engine number"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Year of Manufacture</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={yom}
    //               onChange={(e) => setYom(e.target.value)}
    //               placeholder="Enter year of manufacture"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Fuel</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={fuel}
    //               onChange={(e) => setFuel(e.target.value)}
    //               placeholder="Enter fuel type"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Horsepower</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={power}
    //               onChange={(e) => setPower(e.target.value)}
    //               placeholder="Enter horsepower"
    //             />
    //           </div>
    //         </div>
    //         <div className="col-6">
    //           <div className="mb-3">
    //             <label className="form-label">Total Cost</label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               value={totalCost}
    //               onChange={(e) => setTotalCost(e.target.value)}
    //               placeholder="Enter total cost"
    //             />
    //           </div>
    //         </div>
    //       </div>
    // <div className="d-flex justify-content-end mt-3">
    //   <button type="submit" className="btn btn-primary me-2">
    //     {loading ? <FNSpinner /> : "Update Vehicle"}
    //   </button>
    //   <button
    //     type="button"
    //     className="btn btn-outline-secondary"
    //     onClick={close}
    //   >
    //     Cancel
    //   </button>
    // </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default EditVechile;

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Select from 'react-select';
// import API from "../../../helpers/api";
// import FNSpinner from '../../../components/FNSpinner'

// const EditVechile = ({ id, close, refresh }) => {
//   const [loading, setLoading] = useState(false);
//   const [licensePlate, setLicensePlate] = useState("");
//   const [chassisNo, setChassisNo] = useState("");
//   const [engineNo, setEngineNo] = useState("");
//   const [power, setPower] = useState("");
//   const [makeId, setMakeId] = useState("");
//   const [typeId, setTypeId] = useState("");
//   const [yom, setYear] = useState("");
//   const [fuelType, setFuelType] = useState("");
//   const [gearType, setGearType] = useState("");
//   const [totalCost, setTotalCost] = useState("");
//   const [purchaseDate, setPurchaseDate] = useState("");
//   const [countryOrgin, setCountryOrgin] = useState("");

//   const [types, setTypes] = useState([]);
//   const [makes, setMakes] = useState([]);

//   const vehicleDetails = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/v/vehicle/${id}`);
//       setLicensePlate(res.data.vehicle.licensePlate);
//       setChassisNo(res.data.vehicle.chassisNo);
//       setEngineNo(res.data.vehicle.engineNo);
//       setPower(res.data.vehicle.power);
//       setMakeId(res.data.vehicle.makeId);
//       setTypeId(res.data.vehicle.typeId);
//       setYear(res.data.vehicle.yom);
//       setFuelType(res.data.vehicle.fuelType);
//       setGearType(res.data.vehicle.gearType);
//       setTotalCost(res.data.vehicle.totalCost);
//       setPurchaseDate(res.data.vehicle.purchaseDate);
//       setCountryOrgin(res.data.vehicle.countryOrgin);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   const loadType = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/v/type`);
//       console.log(res)
//       setTypes(res?.data.type);
//       setLoading(false);
//     } catch (error) {
//       console.log("error", error);
//       setLoading(false);
//     }
//   };

//   const handleChangeType = (selectedOption) => {
//     setTypeId(selectedOption.value);
//   };

//   const handleChangeMake = (selectedOption) => {
//     setMakeId(selectedOption.value);
//   };

//   const loadMake = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/v/make`);
//       setMakes(res?.data.make);
//       setLoading(false);
//     } catch (error) {
//       console.log("error", error);
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const data = {
//       licensePlate,
//       chassisNo,
//       engineNo,
//       power,
//       makeId,
//       typeId,
//       yom,
//       fuelType,
//       gearType,
//       totalCost,
//       purchaseDate,
//       countryOrgin
//     };

//     try {
//       const response = await API.patch(`/v/vehicle/${id}`, data,);
//       setLoading(false);
//       close();
//       refresh();
//       toast.success("Vehicle Update Successfully !!");
//     } catch {
//       setLoading(false);
//       toast.error("Error while Updating Vehicle");
//     }
//   };

//   useEffect(() => {
//     loadType();
//     loadMake();
//     vehicleDetails();
//   }, []);

//   return (
//     <div class="card">
//       <div class="card-body">
//         <div className="row">
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">License Plate Number</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Number Plate"
//                 value={licensePlate}
//                 onChange={(e) => setLicensePlate(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Type</label>
//               <Select

//                 defaultValue={typeId}
//                 onChange={handleChangeType}
//                 options={types.map(type => ({ value: type.id, label: type.name }))}
//                 placeholder="Select Vehicle Type"
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Make</label>
//               <Select
//                 defaultValue={makeId}
//                 onChange={handleChangeMake}
//                 options={makes.map(make => ({ value: make.id, label: make.name }))}
//                 placeholder="Select Vehicle Make"
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Chassis Number</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Chassis Number"
//                 value={chassisNo}
//                 onChange={(e) => setChassisNo(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Engine Number</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Engine Number"
//                 value={engineNo}
//                 onChange={(e) => setEngineNo(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Fuel Type</label>
//               <select class="form-select" aria-label="Select example" value={fuelType}
//                 onChange={(e) => setFuelType(e.target.value)}>
//                 <option>Select Fuel Type </option>
//                 <option>Diesel</option>
//                 <option>Petrol</option>
//               </select>
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Horse Power</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Horse Power"
//                 value={power}
//                 onChange={(e) => setPower(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Year Of Manufacture</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Year of Manufacture"
//                 value={yom}
//                 onChange={(e) => setYear(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Gear Type</label>
//               <select class="form-select" aria-label="Select example" value={gearType}
//                 onChange={(e) => setGearType(e.target.value)}>
//                 <option>Select Gear Type </option>
//                 <option>Manual</option>
//                 <option>Automatic</option>
//               </select>
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Total Cost</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Total Cost"
//                 value={totalCost}
//                 onChange={(e) => setTotalCost(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Purchase Date</label>
//               <input type="date" class="form-control" autocomplete="off" placeholder="Purchase date"
//                 value={purchaseDate}
//                 onChange={(e) => setPurchaseDate(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="col-4">
//             <div class="mb-3">
//               <label class="form-label">Country of Orgin</label>
//               <input type="text" class="form-control" autocomplete="off" placeholder="Country of Origin"
//                 value={countryOrgin}
//                 onChange={(e) => setCountryOrgin(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="div mt-3">
//           <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Add New Vehicle"}</button>
//           <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditVechile
