import React from "react";

function VehicleTable({ vehicle }) {
  return (
    <div class="table-responsive">
      <table class="table table-bordered border-secondary border-opacity-25  table-sm">
        <tbody>
          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Old Number Plate
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.old_number_plate : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              New Number Plate
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.new_number_plate : ""}</td>
          </tr>
          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Country Of Origin
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.country_of_origin : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Color
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.color : ""}</td>
          </tr>

          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Engine Number
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.engine_no : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Fuel Type
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.fuel : ""}</td>
          </tr>
          <tr>
            {" "}
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Chassis Number
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.chassis_no : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              YOM
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.YOM : ""}</td>
          </tr>
          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Type
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.Type : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Total Cost
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.Total_Cost : ""}</td>
          </tr>
          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Make
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.make : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Power
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.power : ""}</td>
          </tr>

          <tr>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              Model
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.model : ""}</td>
            <th
              className="py-2 "
              scope="row"
              style={{
                backgroundColor: "#DAE1F3",
                color: "#598BFF",
                // maxWidth: "20px",
              }}
            >
              User Department
            </th>
            <td className="bg-transparent">{vehicle ? vehicle.User_department : ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VehicleTable;
