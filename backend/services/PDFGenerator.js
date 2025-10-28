const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
    constructor() {
        this.doc = null;
    }

    // Generate GRN PDF
    async generateGRN(grnData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const filename = `GRN-${grnData.grn_number || Date.now()}.pdf`;
                const filepath = path.join('uploads', filename);
                
                // Ensure uploads directory exists
                if (!fs.existsSync('uploads')) {
                    fs.mkdirSync('uploads', { recursive: true });
                }

                doc.pipe(fs.createWriteStream(filepath));

                // Header
                doc.fontSize(20)
                   .text('MINISTRY OF HEALTH UGANDA', 50, 50, { align: 'center' });
                
                doc.fontSize(16)
                   .text('GOODS RECEIVED NOTE (GRN)', 50, 80, { align: 'center' });

                // GRN Details
                doc.fontSize(12)
                   .text(`GRN Number: ${grnData.grn_number || 'N/A'}`, 50, 120)
                   .text(`Date Received: ${grnData.date_received || 'N/A'}`, 50, 140)
                   .text(`Supplier: ${grnData.supplier_name || 'N/A'}`, 50, 160)
                   .text(`LPO Number: ${grnData.lpo_no || 'N/A'}`, 50, 180)
                   .text(`Delivery Location: ${grnData.delivery_location || 'N/A'}`, 50, 200);

                // Items table header
                doc.text('ITEMS RECEIVED:', 50, 240)
                   .moveDown(0.5);

                // Table headers
                const tableTop = 260;
                doc.text('S/N', 50, tableTop)
                   .text('Description', 100, tableTop)
                   .text('Qty Ordered', 300, tableTop)
                   .text('Qty Delivered', 380, tableTop)
                   .text('Qty Accepted', 460, tableTop);

                // Draw table lines
                doc.moveTo(50, tableTop + 20)
                   .lineTo(550, tableTop + 20)
                   .stroke();

                // Items
                let yPosition = tableTop + 30;
                if (grnData.items && grnData.items.length > 0) {
                    grnData.items.forEach((item, index) => {
                        doc.text(`${index + 1}`, 50, yPosition)
                           .text(item.description || '', 100, yPosition)
                           .text(item.quantity_ordered || '0', 300, yPosition)
                           .text(item.quantity_delivered || '0', 380, yPosition)
                           .text(item.quantity_accepted || '0', 460, yPosition);
                        yPosition += 20;
                    });
                }

                // Footer
                doc.text('Remarks:', 50, yPosition + 20)
                   .text(grnData.remarks || 'None', 50, yPosition + 40);

                // Signatures
                doc.text('Receiving Officer: _________________', 50, yPosition + 80)
                   .text('Date: _________________', 300, yPosition + 80)
                   .text('Issuing Officer: _________________', 50, yPosition + 120)
                   .text('Date: _________________', 300, yPosition + 120);

                doc.end();

                doc.on('end', () => {
                    resolve({
                        filename,
                        filepath,
                        size: fs.statSync(filepath).size
                    });
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Generate Asset Report PDF
    async generateAssetReport(assets) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const filename = `Asset-Report-${Date.now()}.pdf`;
                const filepath = path.join('uploads', filename);
                
                if (!fs.existsSync('uploads')) {
                    fs.mkdirSync('uploads', { recursive: true });
                }

                doc.pipe(fs.createWriteStream(filepath));

                // Header
                doc.fontSize(20)
                   .text('MINISTRY OF HEALTH UGANDA', 50, 50, { align: 'center' });
                
                doc.fontSize(16)
                   .text('ASSET INVENTORY REPORT', 50, 80, { align: 'center' });

                doc.fontSize(12)
                   .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 110);

                // Assets table
                doc.text('ASSET INVENTORY:', 50, 140)
                   .moveDown(0.5);

                const tableTop = 160;
                doc.text('Asset ID', 50, tableTop)
                   .text('Description', 100, tableTop)
                   .text('Serial No.', 250, tableTop)
                   .text('Status', 350, tableTop)
                   .text('Location', 420, tableTop);

                doc.moveTo(50, tableTop + 20)
                   .lineTo(550, tableTop + 20)
                   .stroke();

                let yPosition = tableTop + 30;
                if (assets && assets.length > 0) {
                    assets.forEach((asset, index) => {
                        doc.text(`${asset.id || index + 1}`, 50, yPosition)
                           .text(asset.description || '', 100, yPosition)
                           .text(asset.serialNo || '', 250, yPosition)
                           .text(asset.status || 'Unknown', 350, yPosition)
                           .text(asset.location || 'Unknown', 420, yPosition);
                        yPosition += 20;
                    });
                }

                doc.end();

                doc.on('end', () => {
                    resolve({
                        filename,
                        filepath,
                        size: fs.statSync(filepath).size
                    });
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Generate User Report PDF
    async generateUserReport(users) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const filename = `User-Report-${Date.now()}.pdf`;
                const filepath = path.join('uploads', filename);
                
                if (!fs.existsSync('uploads')) {
                    fs.mkdirSync('uploads', { recursive: true });
                }

                doc.pipe(fs.createWriteStream(filepath));

                // Header
                doc.fontSize(20)
                   .text('MINISTRY OF HEALTH UGANDA', 50, 50, { align: 'center' });
                
                doc.fontSize(16)
                   .text('USER MANAGEMENT REPORT', 50, 80, { align: 'center' });

                doc.fontSize(12)
                   .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 110);

                // Users table
                doc.text('USER LIST:', 50, 140)
                   .moveDown(0.5);

                const tableTop = 160;
                doc.text('Username', 50, tableTop)
                   .text('Full Name', 150, tableTop)
                   .text('Email', 300, tableTop)
                   .text('Role', 450, tableTop)
                   .text('Status', 500, tableTop);

                doc.moveTo(50, tableTop + 20)
                   .lineTo(550, tableTop + 20)
                   .stroke();

                let yPosition = tableTop + 30;
                if (users && users.length > 0) {
                    users.forEach((user, index) => {
                        doc.text(user.username || '', 50, yPosition)
                           .text(`${user.firstname || ''} ${user.lastname || ''}`, 150, yPosition)
                           .text(user.email || '', 300, yPosition)
                           .text(user.role || '', 450, yPosition)
                           .text(user.is_active ? 'Active' : 'Inactive', 500, yPosition);
                        yPosition += 20;
                    });
                }

                doc.end();

                doc.on('end', () => {
                    resolve({
                        filename,
                        filepath,
                        size: fs.statSync(filepath).size
                    });
                });

            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = PDFGenerator;
