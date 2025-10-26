import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { useState, useEffect, Fragment } from 'react'
import moment from 'moment';
import API from "../../../helpers/api";
import FSpinner from '../../../components/FNSpinner'
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const ActivityPerParicipant = () => {
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState([]);

    const loadDays = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/participant`);
            console.log(res)
            setDays(res?.data);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX',
          minimumFractionDigits: 0,
        }).format(value);
      };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(days);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Flagged Users");
        XLSX.writeFile(workbook, "activity_per_participant.xlsx");
    };

    const downloadPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Add Header Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Ministry of Health Activity Tracker', pageWidth / 2, 15, {
            align: 'center'
        });

        // Add subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Activity Per Paricipant Report', pageWidth / 2, 22, {
            align: 'center'
        });

        // Add current date
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.setFontSize(10);
        doc.text(`Generated on: ${currentDate}`, pageWidth - 15, 10, {
            align: 'right'
        });

        // Table headers
        const headers = [['Name', 'Title', 'Phone', 'Activity Name', 'Days', 'Amount', 'Invoice Date', 'Voucher No', 'Funder']];
        const data = days.map(item => [
            item.name,
            item.title,
            item.phone,
            item.activityName,
            item.days,
            formatCurrency(item.amount),
            moment(item.invoiceDate).format('YYYY-MM-DD'),
            item.vocherno,
            item.funder
        ]);

        // Add table using jspdf-autotable
        import('jspdf-autotable').then((module) => {
            const { default: autoTable } = module;
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 30,
                margin: { top: 30 },
                styles: { overflow: 'linebreak' },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
            });

            // Add footer text
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Footer text
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128); // Gray color
                doc.text('System Generated Report', pageWidth / 2, pageHeight - 10, {
                    align: 'center'
                });

                // Page numbers
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 10, {
                    align: 'right'
                });
            }

            doc.save('activity_per_participant.pdf');
        });
    };

    useEffect(() => {
        loadDays();
    }, []);

    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page d-sm-flex align-items-center justify-content-between mb-3">
                        <h4 class="mb-sm-0 font-size-18">Activity Per Paricipant Report</h4>
                        <div class="page-title-right">
                            <button
                                className="btn btn-primary me-2"
                                onClick={downloadExcel}
                                disabled={loading || !days.length}
                            >
                                <i className="bx bx-download me-1"></i>
                                Download Excel
                            </button>
                            <button
                                className="btn btn-info"
                                onClick={downloadPDF}
                                disabled={loading || !days.length}
                            >
                                <i className="bx bx-file me-1"></i>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row mb-2">
                                        <div class="col-sm-4">
                                            <div class="search-box me-2 mb-2 d-inline-block">
                                                <div class="position-relative">
                                                    <input type="text" class="form-control" id="searchTableList" placeholder="Search..." />
                                                    <i class="bx bx-search-alt search-icon"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {loading ? <FSpinner /> :
                                        <div class="table-responsive">
                                            <table class="table align-middle table-striped table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Title</th>
                                                        <th>Phone</th>
                                                        <th>Activity</th>
                                                        <th>Days</th>
                                                        <th>Amount</th>
                                                        <th>Invoice Date</th>
                                                        <th>Voucher No</th>
                                                        <th>Funder</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {days &&
                                                        days.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.name}</td>
                                                                <td>{item.title}</td>
                                                                <td>{item.phone}</td>
                                                                <td>{item.activityName}</td>
                                                                <td>{item.days}</td>
<NumberFormat
                                                                    value={item.amount}
                                                                    displayType={'text'}
                                                                    thousandSeparator={true}
                                                                    decimalScale={0}
                                                                />
                                                                <td>{moment(item.invoiceDate).format('YYYY-MM-DD')}</td>
                                                                <td>{item.vocherno}</td>
                                                                <td>{item.funder}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ActivityPerParicipant