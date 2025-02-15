import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  DialogContentText,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns"; // Use date-fns for date formatting
import jsPDF from "jspdf"; // PDF Export Library
import { utils, writeFile } from "xlsx"; // Excel Export Library
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Import PDF icon
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone"; // Import Excel icon
import { Email as EmailIcon } from "@mui/icons-material"; // Add Email icon
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// const API_URL = "https://km-enterprices.onrender.com/quotations";
const API_URL = "http://localhost:5000/taxInvoices";

const TaxInvoiceTable = () => {
  const [tableData, setTableData] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState(tableData);
  // Extract unique company names and dates from tableData
  const companies = [
    ...new Set(tableData.map((invoice) => invoice.invoiceDate)),
  ];
  const dates = [...new Set(tableData.map((invoice) => invoice.dueDate))];

  const [search, setSearch] = useState("");
  const [gmail, setGmail] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogGmailpen, setDialogGmailpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNo: "",
    workOrderNo: "",
    invoiceDate: "",
    itemDescription: "",
    quantity: "",
    unitPrice: "",
    totalPrice: "",
    taxRate: "",
    invoiceStatus: "",
    dueDate: "",
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [errors, setErrors] = useState({});

  const [mode, setMode] = useState("add");

  const [rows, setRows] = useState([
    {
      invoiceNo: "",
      workOrderNo: "",
      invoiceDate: "",
      itemDescription: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
      taxRate: "",
      invoiceStatus: "",
      dueDate: "",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        invoiceNo: "",
        workOrderNo: "",
        invoiceDate: "",
        itemDescription: "",
        quantity: "",
        unitPrice: "",
        totalPrice: "",
        taxRate: "",
        invoiceStatus: "",
        dueDate: "",
      },
    ]);
  };

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  const handleApplyFilter = () => {
    let filtered = tableData;

    if (selectedCompany) {
      filtered = filtered.filter(
        (invoice) => invoice.invoiceDate === selectedCompany
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((invoice) => invoice.dueDate === selectedDate);
    }

    setFilteredData(filtered);
    setPage(0); // Reset page to 0 after applying filters
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set font and size for the header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("K.M. ENTERPRISES", 10, 10);

    // Add subheader
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "(CIVIL & SAND, COPPER SLAG, GRIT BLASTING, SCAFFOLDING, EPOXY PAINTING, ROOF SHEET, INDUSTRIAL MAINTENANCE WORK)",
      10,
      20
    );
    doc.text(
      "D.No. V4 3-28/1, Sathya prakash Building, Kultur, Mangalore, D.K. - 575 013",
      10,
      30
    );
    doc.text("Email : kmenterprises0897@gmail.com", 10, 40);

    // Add "TAX INVOICE OF SERVICE" heading
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE OF SERVICE", 10, 50);

    // Add invoice details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("To, SANTHOSHIMATHAA EDIBLES OILS REFINERY PVT LTD", 10, 60);
    doc.text(
      "PLOT NO B1, OPP R.C.H.W QUARTERS, BAIKAMPADY INDUSTRIAL ESTATE ROAD",
      10,
      70
    );
    doc.text(
      "NEAR IPL GODOWN, MANGALORE, DAKSHINA KANNADA, KARNATAKA-575010",
      10,
      80
    );
    doc.text("GSTIN: 29AARCS1166P1ZF", 10, 90);

    // Add invoice number and date
    doc.text("INVOICE NO: 81", 150, 60);
    doc.text("DATE: 18/01/2025", 150, 70);
    doc.text("P.O No: SEO-SEORPL/KA/WO/038", 150, 80);
    doc.text("P.O Date: 21/11/2023", 150, 90);

    // Define table columns
    const tableColumn = [
      "S.L NO",
      "DESCRIPTION",
      "UNIT",
      "QTY",
      "RATE (Rupees)",
      "TOTAL AMOUNT",
    ];
    const tableRows = [];

    // Prepare table rows
    filteredData.forEach((invoice, index) => {
      const rowData = [
        index + 1,
        invoice.itemDescription,
        invoice.unit,
        invoice.quantity,
        invoice.unitPrice,
        invoice.totalPrice,
      ];
      tableRows.push(rowData);
    });

    // Add table to PDF
    doc.autoTable({
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Black header with white text
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternate row
    });

    // Add taxable amount and GST
    const taxableAmount = filteredData.reduce(
      (sum, invoice) => sum + invoice.totalPrice,
      0
    );
    const cgst = taxableAmount * 0.09;
    const sgst = taxableAmount * 0.09;
    const totalAmount = taxableAmount + cgst + sgst;

    doc.setFontSize(10);
    doc.text(
      `TAXABLE AMOUNT: ${taxableAmount.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `ADD: CGST @ 9%: ${cgst.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(
      `ADD: SGST @ 9%: ${sgst.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 30
    );
    doc.text(
      `TOTAL: ${totalAmount.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 40
    );

    // Add footer with bank details
    doc.setFontSize(10);
    doc.text("Bank details:", 10, doc.autoTable.previous.finalY + 60);
    doc.text("M/S K.M ENTERPRISES", 10, doc.autoTable.previous.finalY + 70);
    doc.text(
      "BANK NAME: UNION BANK OF INDIA",
      10,
      doc.autoTable.previous.finalY + 80
    );
    doc.text(
      "ACCOUNT NO: 017621010000026",
      10,
      doc.autoTable.previous.finalY + 90
    );
    doc.text("IFSC CODE: UBIN0901768", 10, doc.autoTable.previous.finalY + 100);
    doc.text(
      "GSTIN NO: 29DRZPM1536G12Z5",
      10,
      doc.autoTable.previous.finalY + 110
    );
    doc.text("PAN NO: DRZPM1536G", 10, doc.autoTable.previous.finalY + 120);
    doc.text("STATE: KARNATAKA", 10, doc.autoTable.previous.finalY + 130);

    // Add "Yours faithfully" and signature
    doc.text("Yours faithfully", 10, doc.autoTable.previous.finalY + 150);
    doc.text("For K.M ENTERPRISES", 10, doc.autoTable.previous.finalY + 160);

    // Save the PDF
    doc.save("Invoice.pdf");
  };

  const handleRemoveRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (Array.isArray(data)) {
        setTableData(data);
        setFilteredData(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setTableData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearch(searchText);

    // Filter the tableData based on the search input across all fields
    const filtered = tableData.filter((invoice) => {
      // Check if any field in the invoice contains the search text
      return Object.values(invoice).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return value.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    });

    setFilteredData(filtered);
    setPage(0); // Reset page to 0 after applying search
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = [...tableData].sort((a, b) => {
      if (a[property] < b[property]) return isAscending ? -1 : 1;
      if (a[property] > b[property]) return isAscending ? 1 : -1;
      return 0;
    });

    setTableData(sortedData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogOpenAdd = () => {
    // Reset the rows state to its initial value
    setRows([
      {
        invoiceNo: "",
        workOrderNo: "",
        invoiceDate: "",
        itemDescription: "",
        quantity: "",
        unitPrice: "",
        totalPrice: "",
        taxRate: "",
        invoiceStatus: "",
        dueDate: "",
      },
    ]);

    // Set the mode to "add" and open the dialog
    setMode("add");
    setDialogOpen(true);
  };

  const handleDialogOpenEdit = (invoice) => {
    // Convert the invoice data into the format expected by the rows state
    const invoiceRows = [
      {
        invoiceNo: invoice.invoiceNo,
        workOrderNo: invoice.workOrderNo,
        invoiceDate: new Date(invoice.invoiceDate).toISOString().split("T")[0], // Format to YYYY-MM-DD
        itemDescription: invoice.itemDescription,
        quantity: invoice.quantity,
        unitPrice: invoice.unitPrice,
        totalPrice: invoice.totalPrice,
        taxRate: invoice.taxRate,
        invoiceStatus: invoice.invoiceStatus,
        dueDate: new Date(invoice.dueDate).toISOString().split("T")[0], // Format to YYYY-MM-DD
        _id: invoice._id,
      },
    ];

    // Set the rows state with the invoice data
    setRows(invoiceRows);

    // Set the mode to "edit" and open the dialog
    setMode("edit");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleGmailDialogClose = () => {
    setDialogGmailpen(false);
  };

  const handleViewDialogOpen = (invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleDeleteDialogOpen = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedInvoice._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTableData(
          tableData.filter((item) => item._id !== selectedInvoice._id)
        );
        showSnackbar("Invoice deleted successfully!", "success");
      } else {
        showSnackbar("Failed to delete invoice.", "error");
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete data:", error);
      showSnackbar("Error deleting invoice.", "error");
    }
  };

  const validateFields = () => {
    let tempErrors = {};

    if (!newInvoice.companyName.trim())
      tempErrors.companyName = "Company Name is required";
    if (!newInvoice.date) tempErrors.date = "Date is required";
    if (!newInvoice.description.trim())
      tempErrors.description = "Description is required";
    if (!newInvoice.unit.trim()) tempErrors.unit = "Unit is required";
    if (!newInvoice.qty || isNaN(newInvoice.qty) || newInvoice.qty <= 0)
      tempErrors.qty = "Enter a valid quantity";
    if (!newInvoice.rate || isNaN(newInvoice.rate) || newInvoice.rate <= 0)
      tempErrors.rate = "Enter a valid rate";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  const handleAddInvoice = async () => {
    const isValid = rows.every((row) => {
      return (
        row.invoiceDate &&
        row.itemDescription.trim() &&
        row.quantity &&
        row.unitPrice &&
        row.dueDate
      );
    });

    if (!isValid) {
      showSnackbar(
        "Validation failed. Please fill all required fields.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });

      if (response.ok) {
        const addedInvoices = await response.json();
        setTableData([...addedInvoices, ...tableData]); // Update tableData with new data
        showSnackbar("Invoices added successfully!", "success");
        setRows([
          {
            invoiceNo: "",
            workOrderNo: "",
            invoiceDate: "",
            itemDescription: "",
            quantity: "",
            unitPrice: "",
            totalPrice: "",
            taxRate: "",
            invoiceStatus: "",
            dueDate: "",
          },
        ]);
        handleDialogClose();
      } else {
        showSnackbar("Failed to add invoices.", "error");
      }
    } catch (error) {
      console.error("Failed to add data:", error);
      showSnackbar("Error adding invoices.", "error");
    }
  };

  const handleEditInvoice = async () => {
    try {
      const response = await fetch(`${API_URL}/${rows[0]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows[0]),
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        setTableData(
          tableData.map((item) =>
            item._id === rows[0]._id ? updatedInvoice : item
          )
        );
        showSnackbar("Tax Invoice updated successfully!", "success");
      } else {
        const errorData = await response.json();
        showSnackbar(
          `Failed to update Tax Invoice: ${errorData.message}`,
          "error"
        );
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update data:", error);
      showSnackbar("Error updating Tax Invoice.", "error");
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    if (name === "qty" || name === "rate") {
      newRows[index].total = newRows[index].qty * newRows[index].rate || 0;
    }
    setRows(newRows);
  };
  const handleGmailChange = (e) => {
    setGmail(e.target.value);
  };

  const exportToPDF = (invoice) => {
    const doc = new jsPDF();

    // Set up the header with a custom title (KM Enterprises)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("KM Enterprises", 10, 10);

    // Add a line under the header
    doc.setLineWidth(0.5);
    doc.line(10, 12, 200, 12);

    // Set up the body content with invoice details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoice.invoiceNo}`, 10, 30);
    doc.text(`Work Order No: ${invoice.workOrderNo}`, 10, 40);
    doc.text(`Invoice Date: ${invoice.invoiceDate}`, 10, 50);
    doc.text(`Item Description: ${invoice.itemDescription}`, 10, 60);
    doc.text(`Quantity: ${invoice.quantity}`, 10, 70);
    doc.text(`Unit Price: ${invoice.unitPrice}`, 10, 80);
    doc.text(`Total Price: ${invoice.totalPrice}`, 10, 90);
    doc.text(`Tax Rate: ${invoice.taxRate}`, 10, 100);
    doc.text(`Invoice Status: ${invoice.invoiceStatus}`, 10, 110);
    doc.text(`Due Date: ${invoice.dueDate}`, 10, 120);

    // Add a footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);

    doc.text(
      `Page ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF with the file name
    doc.save(`${invoice.invoiceNo}_Invoice.pdf`);
  };

  const exportToExcel = (invoice) => {
    const worksheet = utils.json_to_sheet([invoice]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Invoice");
    writeFile(workbook, `${invoice.invoiceNo}_Invoice.xlsx`);
  };

  const columns = [
    { id: "invoiceNo", label: "Invoice No" },
    { id: "workOrderNo", label: "Work Order No" },
    { id: "invoiceDate", label: "Invoice Date" },
    { id: "itemDescription", label: "Item Description" },
    { id: "quantity", label: "Quantity" },
    { id: "unitPrice", label: "Unit Price" },
    { id: "totalPrice", label: "Total Price" },
    { id: "taxRate", label: "Tax Rate" },
    { id: "invoiceStatus", label: "Invoice Status" },
    { id: "dueDate", label: "Due Date" },
  ];

  const sendEmail = () => {
    // Logic to send PDF and Excel files via email
    const email = gmail; // Replace with the actual email input from the user or a predefined email
    const subject = `Tax Invoice for ${invoiceData.companyName}`;
    const body = `Please find attached the PDF and Excel files for the quotation.\n\nDate: ${invoiceData.date}\nDescription: ${invoiceData.description}`;

    // Trigger mailto link to open the default email client with attachments (Note: mailto does not support attachments)
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open the user's email client with the pre-filled details
    window.location.href = mailtoLink;
    setDialogGmailpen(false);
  };

  const handleResetFilter = () => {
    // Reset the filter dropdown values
    setSelectedCompany("");
    setSelectedDate("");

    fetchData();
  };

  return (
    <Box sx={{ padding: "20px", overflowX: "auto" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: "10px" }}
      >
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant="h6" gutterBottom>
            Showing {filteredData.length} Items
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          container
          spacing={2}
          justifyContent="flex-end"
        >
          <Grid item xs={8} sm={8}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleSearch}
              sx={{
                maxWidth: "100%",
                marginTop: "8px",
              }}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogOpenAdd}
              sx={{ width: "100%" }}
            >
              Add Tax Invoice
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Invoice Dates</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              label="Company"
            >
              <MenuItem value="">Due Dates</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company} value={company}>
                  {format(new Date(company), "dd-MM-yyyy")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Due Date</InputLabel>
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              label="Date"
            >
              <MenuItem value="">All Dates</MenuItem>
              {dates.map((date) => (
                <MenuItem key={date} value={date}>
                  {format(new Date(date), "dd-MM-yyyy")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilter}
            sx={{ width: "100%", height: "56px" }}
          >
            Apply
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleResetFilter}
            sx={{ width: "100%", height: "56px" }}
          >
            Reset Filter
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownloadPDF}
            sx={{ width: "100%", height: "56px" }}
          >
            Download PDF
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "peachpuff" }}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell>{invoice.workOrderNo}</TableCell>
                    <TableCell>
                      {invoice.invoiceDate
                        ? format(new Date(invoice.invoiceDate), "dd-MM-yyyy")
                        : "Invalid Date"}
                    </TableCell>
                    <TableCell>{invoice.itemDescription}</TableCell>
                    <TableCell>{invoice.quantity}</TableCell>
                    <TableCell>{invoice.unitPrice}</TableCell>
                    <TableCell>{invoice.totalPrice}</TableCell>
                    <TableCell>{invoice.taxRate}</TableCell>
                    <TableCell>{invoice.invoiceStatus}</TableCell>
                    <TableCell>
                      {invoice.dueDate
                        ? format(new Date(invoice.dueDate), "dd-MM-yyyy")
                        : "Invalid Date"}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      style={{ display: "flex" }}
                    >
                      <IconButton
                        onClick={() => exportToPDF(invoice)}
                        color="primary"
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => exportToExcel(invoice)}
                        color="primary"
                      >
                        <FileDownloadDoneIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDialogOpenEdit(invoice)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDialogOpen(invoice)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No records found</Typography>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        className="quotation-dialog"
        PaperProps={{
          sx: {
            width: "95%",
            maxWidth: "1400px",
            overflowX: "auto",
            p: 2,
          },
        }}
      >
        <DialogTitle>
          {mode === "add" ? "Add Tax Invoice" : "Edit Tax Invoice"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {rows.map((row, index) => (
            <Grid
              container
              spacing={1}
              key={index}
              sx={{
                display: "flex",
                flexWrap: { xs: "wrap", md: "nowrap" },
                alignItems: "center",
                gap: 1,
                mb: 2,
                borderBottom: "1px solid #ddd",
                pb: 1,
              }}
            >
              <Grid item xs={12} sm={1}>
                <TextField
                  label="Invoice No"
                  name="invoiceNo"
                  value={row.invoiceNo}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField
                  label="Work Order No"
                  name="workOrderNo"
                  value={row.workOrderNo}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Invoice Date"
                  name="invoiceDate"
                  type="date"
                  value={row.invoiceDate}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Description"
                  name="itemDescription"
                  value={row.itemDescription}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={1}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={1}>
                <TextField
                  label="Unit Price"
                  name="unitPrice"
                  type="number"
                  value={row.unitPrice}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={1}>
                <TextField
                  label="Total Price"
                  name="totalPrice"
                  value={row.quantity * row.unitPrice || 0}
                  disabled
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={1}>
                <TextField
                  label="Tax Rate"
                  name="taxRate"
                  type="number"
                  value={row.taxRate}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={1}>
                <TextField
                  label="Invoice Status"
                  name="invoiceStatus"
                  value={row.invoiceStatus}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={row.dueDate}
                  onChange={(e) => handleInputChange(e, index)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {mode === "add" && (
                <Grid
                  item
                  xs={6}
                  sm={1}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <IconButton onClick={() => handleRemoveRow(index)}>
                    <RemoveIcon />
                  </IconButton>
                  {index === rows.length - 1 && (
                    <IconButton onClick={handleAddRow}>
                      <AddIcon />
                    </IconButton>
                  )}
                </Grid>
              )}
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={mode === "add" ? handleAddInvoice : handleEditInvoice} // Conditionally call the correct function
            variant="contained"
            color="primary"
          >
            {mode === "add" ? "Add to Table" : "Update Tax Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this Tax Invoice?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogGmailpen} onClose={handleGmailDialogClose}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Gmail"
                name="gmail"
                value={gmail}
                onChange={handleGmailChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGmailDialogClose}>Cancel</Button>
          <Button onClick={sendEmail}>{"Send"}</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>View Tax Invoice</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <>
              <DialogContentText>
                <strong>Company Name:</strong> {selectedInvoice.companyName}
              </DialogContentText>
              <DialogContentText>
                <strong>Date:</strong>{" "}
                {format(new Date(selectedInvoice.date), "dd-MM-yyyy")}
              </DialogContentText>
              <DialogContentText>
                <strong>Description:</strong> {selectedInvoice.description}
              </DialogContentText>
              <DialogContentText>
                <strong>Unit:</strong> {selectedInvoice.unit}
              </DialogContentText>
              <DialogContentText>
                <strong>Qty:</strong> {selectedInvoice.qty}
              </DialogContentText>
              <DialogContentText>
                <strong>Rate:</strong> {selectedInvoice.rate}
              </DialogContentText>
              <DialogContentText>
                <strong>Total:</strong> {selectedInvoice.total}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaxInvoiceTable;
