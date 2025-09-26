import React, { useState, useEffect, useRef } from "react";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";
import JobCardData from "./JobCardData";
import EditSpare from "./EditSpare";
import AddJobCardSpare from "./AddJobCardSpare";

const JobCardDetail = ({ match }) => {
  const [jobcard, setJobCard] = useState({});
  const [jobCardSpare, setJobCardSpare] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id } = match.params;
  const printRef = useRef();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const loadJobCard = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/jobcards/${id}`);
      console.log("Fetched Job Card:", res);
      setJobCard(res?.data.job);

      await loadJobCardSpare();

      setLoading(false);
    } catch (error) {
      console.error("Error fetching job card:", error);
      setLoading(false);
    }
  };

  const loadJobCardSpare = async () => {
    try {
      const res = await API.get(`/jobcard/spare/${id}`);
      console.log("Fetched Job Card spare:", res?.data?.spareparts);
      setJobCardSpare(res?.data?.spareparts);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    loadJobCard();
  }, []); // Added loadJobCard to dependencies

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  if (loading) {
    return <FNSpinner />;
  }

  return (
    <div className="container-flui ">
      <div className="row justify-content-cent ">
        <div className="col-12">
          <div className="card bg-light border rounded shadow">
            <div className="card-body">
              <div ref={printRef}>
                <JobCardData id={id} />
                <div className="row">
                  <div className="col-12">
                    <div className="card bg-transparent">
                      <div className="card-body">
                        <h4 className="card-title mb-4">
                          Job Card Spare Parts
                        </h4>
                        <section>
                          <table className="table table-striped table-sm">
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: "30%" }}>
                                  Spare Part Name
                                </th>
                                <th style={{ width: "20%" }}>part Number</th>
                                <th style={{ width: "15%" }}>Qty Used</th>
                                <th style={{ width: "25%" }}>
                                  Unit Of Measure
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobCardSpare.map((part, index) => (
                                <tr key={index}>
                                  <td className="bg-transparent">
                                    {part?.partname}
                                  </td>
                                  <td className="bg-transparent">
                                    {part.partno || 0}
                                  </td>
                                  <td className="bg-transparent">
                                    {part.qtyUsed || 0}
                                  </td>

                                  <td className="bg-transparent">
                                    {part.measure || "None"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-4">
                <button
                  className="btn btn-outline-warning"
                  onClick={handlePrint}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Job Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardDetail;

// import { useState, useEffect, useRef, Fragment } from "react";
// import ReactToPrint from "react-to-print";
// import API from "../../../helpers/api";
// import FNSpinner from "../../../components/FNSpinner";
// import { LucideDownload } from "lucide-react";
// import JobCardData from "./JobCardData";

// const JobCardDetail = ({ match }) => {
//   const [jobcard, setJobCard] = useState({});
//   const [jobCardSpare, setJobCardSpare] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   const { id } = match.params;
//   const componentRef = useRef();

//   const loadJobCard = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/jobcards/${id}`);
//       console.log("Fetched Job Card:", res); // Log to verify data structure
//       setJobCard(res?.data.job);

//       loadJobCradSpare();

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching job card:", error);
//       setLoading(false);
//     }
//   };

//   const loadJobCradSpare = async () => {
//     // setLoading(true);
//     try {
//       const res = await API.get(`/jobcard/spare/${id}`);

//       // console.log("-----job spare", res?.data?.spareparts);
//       setJobCardSpare(res?.data?.spareparts);
//       // setLoading(false);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       // setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadJobCard();
//   }, []);

//   if (loading) {
//     return <FNSpinner />;
//   }

//   //   if (!jobcard.id) {
//   //     return <p>Loading job card details...</p>;
//   //   }

//   console.log("job card spare ====");

//   return (
//     <Fragment>
//       {/* <FNModal
//         showModal={showModal}
//         handleClose={handleClose}
//         lg=""
//         title="Generate Proforma"
//       >
//         <AddDiscount
//           close={handleClose}
//           totalAmt={jobcard.totalAmount}
//           id={id}
//         />
//       </FNModal> */}
//       <div className="container-fluid" ref={componentRef}>
//         <div className="row d-flex justify-content-center">
//           <div className="col-10">
//             <div className="card bg-white bg-opacity-50 border rounded shadow">
//               <div className="card-body bg-opacity-0">
//                 <JobCardData id={id} />
//                 <div className="row">
//                   <div className="col-12">
//                     <div className="card bg-transparent">
//                       <div className="card-body bg-opacity-0">
//                         <h4 className="card-title mb-4">
//                           Job Card Spare Parts
//                         </h4>
//                         <form>
//                           <div className="table-responsiv">
//                             <table className="table table-striped table-sm">
//                               <thead className="table-light">
//                                 <tr>
//                                   <th className="py-3">Spare part </th>
//                                   {/* <th style={{ width: "12%" }}>Unit Price</th> */}
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {jobCardSpare?.map((part) => (
//                                   <tr key={part.id}>
//                                     <td>
//                                       <input
//                                         type="number"
//                                         className="form-control"
//                                         value={part.partname}
//                                         disabled
//                                         placeholder={part.partname}
//                                         // onChange={(e) =>
//                                         //   handleInputChange(
//                                         //     part.id,
//                                         //     "qtyUsed",
//                                         //     parseFloat(e.target.value)
//                                         //   )
//                                         // }
//                                       />
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default JobCardDetail;
