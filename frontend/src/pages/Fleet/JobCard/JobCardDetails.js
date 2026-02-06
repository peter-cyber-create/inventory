/**
 * Ministry of Health Uganda - Fleet Job Card Detail Page
 * Procedural record format - Professional, institutional design
 */
import React, { useState, useEffect, useRef } from "react";
import { Table, Card, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";
import PageLayout from "../../../components/Layout/PageLayout";
import JobCardData from "./JobCardData";
import "../../../theme/moh-institutional-theme.css";

const JobCardDetail = ({ match }) => {
  const [jobcard, setJobCard] = useState({});
  const [jobCardSpare, setJobCardSpare] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = match.params;
  const printRef = useRef();

  const loadJobCard = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/jobcards/${id}`);
      setJobCard(res?.data.job);
      await loadJobCardSpare();
    } catch (error) {
      console.error("Error fetching job card:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobCardSpare = async () => {
    try {
      const res = await API.get(`/api/jobcard/spare/${id}`);
      setJobCardSpare(res?.data?.spareparts || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    loadJobCard();
    // We intentionally only depend on the ID to avoid reloading unnecessarily
  }, [id]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const sparePartsColumns = [
    {
      title: 'Spare Part Name',
      dataIndex: 'partname',
      key: 'partname',
      width: '40%',
    },
    {
      title: 'Part Number',
      dataIndex: 'partno',
      key: 'partno',
      width: '20%',
      render: (text) => text || '-',
    },
    {
      title: 'Quantity Used',
      dataIndex: 'qtyUsed',
      key: 'qtyUsed',
      width: '15%',
      render: (text) => text || 0,
    },
    {
      title: 'Unit of Measure',
      dataIndex: 'measure',
      key: 'measure',
      width: '25%',
      render: (text) => text || 'N/A',
    },
  ];

  if (loading) {
    return <FNSpinner />;
  }

  return (
    <PageLayout
      title={`Fleet Job Card Detail: ${jobcard?.jobcard_no || 'N/A'}`}
      subtitle={`Vehicle: ${jobcard?.vehicle_number_plate || 'N/A'} - Status: ${jobcard?.status || 'N/A'}`}
      extra={[
        <Button 
          key="print" 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={handlePrint}
          style={{
            background: '#006747',
            borderColor: '#006747',
            borderRadius: '4px',
            fontWeight: 600
          }}
        >
          Print Job Card
        </Button>
      ]}
      loading={loading}
    >
      <div ref={printRef}>
        <Card 
          className="institutional-card"
          style={{ 
            border: '1px solid #E1E5E9',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
            marginBottom: '24px'
          }}
        >
          <JobCardData id={id} />
        </Card>

        <Card 
          className="institutional-card"
          title={
            <span style={{ 
              color: '#006747', 
              fontSize: '16px', 
              fontWeight: 600 
            }}>
              Spare Parts Used
            </span>
          }
          style={{ 
            border: '1px solid #E1E5E9',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)'
          }}
        >
          <Table
            dataSource={jobCardSpare}
            columns={sparePartsColumns}
            pagination={false}
            rowKey={(record, index) => record.id || index}
            bordered
            size="middle"
            className="institutional-table"
            locale={{
              emptyText: 'No spare parts recorded for this job card'
            }}
          />
        </Card>
      </div>
    </PageLayout>
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
