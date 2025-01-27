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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns"; // Use date-fns for date formatting
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Import PDF icon
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone"; // Import Excel icon
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const API_URL = "https://km-enterprices.onrender.com/taxInvoices";

const TaxInvoiceTable = () => {
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); // Add loading state

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info

  const [dialogOpen, setDialogOpen] = useState(false);
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [mode, setMode] = useState("add");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(API_URL);
      const data = await response.json();

      // Ensure the data is an array before setting it
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setTableData([]); // Set to empty array in case of unexpected response
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setTableData([]); // Set to empty array in case of an error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
    setNewInvoice({
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
    setMode("add");
    setDialogOpen(true);
  };

  const handleDialogOpenEdit = (invoice) => {
    setNewInvoice({
      ...invoice,
      invoiceDate: invoice.invoiceDate
        ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
        : "",
      dueDate: invoice.dueDate
        ? new Date(invoice.dueDate).toISOString().split("T")[0]
        : "",
    });
    setMode("edit");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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

  const handleAddInvoice = async () => {
    // Validate inputs (as in your existing code)...

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });
      if (response.ok) {
        const addedInvoice = await response.json();
        setTableData([...tableData, addedInvoice]);
        showSnackbar("Invoice added successfully!", "success");
      } else {
        showSnackbar("Failed to add invoice.", "error");
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to add data:", error);
      showSnackbar("Error adding invoice.", "error");
    }
  };

  const handleEditInvoice = async () => {
    // Validate inputs (as in your existing code)...

    try {
      const response = await fetch(`${API_URL}/${newInvoice._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });
      if (response.ok) {
        setTableData(
          tableData.map((item) =>
            item._id === newInvoice._id ? newInvoice : item
          )
        );
        showSnackbar("Invoice updated successfully!", "success");
      } else {
        showSnackbar("Failed to update invoice.", "error");
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update data:", error);
      showSnackbar("Error updating invoice.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const exportToExcel = (invoice) => {
    // Prepare the invoice data as an array of objects (rows)
    const invoiceData = [
      {
        "Invoice No": invoice.invoiceNo,
        "Work Order No": invoice.workOrderNo,
        "Invoice Date": format(new Date(invoice.invoiceDate), "dd-MM-yyyy"),
        Description: invoice.itemDescription,
        Quantity: invoice.quantity,
        "Unit Price": invoice.unitPrice,
        "Total Price": invoice.totalPrice,
        "Tax Rate": invoice.taxRate,
        Status: invoice.invoiceStatus,
        "Due Date": new Date(invoice.dueDate).toISOString().split("T")[0],
      },
    ];

    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(invoiceData);

    // Create a new workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${invoice.invoiceNo}_Invoice.xlsx`);
  };

  const exportToPDF = (invoice) => {
    const doc = new jsPDF();

    // Header with custom title (KM Enterprises)
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("KM Enterprises", 10, 10);

    // Draw a line under the header
    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15);

    // Add the invoice title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 10, 30);

    // Create table headers with background color
    doc.setFillColor(0, 123, 255); // Blue background for headers
    doc.setTextColor(255, 255, 255); // White text color
    doc.rect(10, 35, 190, 10, "F"); // Table header background
    doc.text("Invoice No", 10, 40);
    doc.text("Work Order No", 60, 40);
    doc.text("Invoice Date", 110, 40);
    doc.text("Description", 160, 40);

    // Table row for the first set of data
    doc.setTextColor(0, 0, 0); // Reset text color to black for data
    doc.text(`${invoice.invoiceNo}`, 10, 50);
    doc.text(`${invoice.workOrderNo}`, 60, 50);
    doc.text(`${format(new Date(invoice.invoiceDate), "dd-MM-yyyy")}`, 110, 50);
    doc.text(`${invoice.itemDescription}`, 160, 50);

    // Add another row for quantity, unit price, total price, tax rate
    doc.text("Quantity", 10, 60);
    doc.text("Unit Price", 60, 60);
    doc.text("Total Price", 110, 60);
    doc.text("Tax Rate", 160, 60);

    doc.text(`${invoice.quantity}`, 10, 70);
    doc.text(`${invoice.unitPrice}`, 60, 70);
    doc.text(`${invoice.totalPrice}`, 110, 70);
    doc.text(`${invoice.taxRate}`, 160, 70);

    // Add another row for invoice status and due date
    doc.text("Status", 10, 80);
    doc.text("Due Date", 60, 80);

    doc.text(`${invoice.invoiceStatus}`, 10, 90);
    doc.text(
      `${new Date(invoice.dueDate).toISOString().split("T")[0]}`,
      60,
      90
    );

    // Add a line under the content
    doc.setLineWidth(0.5);
    doc.line(10, 95, 200, 95);

    // Footer with page number
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

  // Filter table data based on search query
  const filteredData = tableData.filter((invoice) => {
    return Object.values(invoice)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

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
              Add Tax Invoices
            </Button>
          </Grid>
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
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
            <TableHead>
              <TableRow style={{ background: "peachpuff" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell>{invoice.invoiceNo}</TableCell>
                      <TableCell>{invoice.workOrderNo}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.invoiceDate), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>{invoice.itemDescription}</TableCell>
                      <TableCell>{invoice.quantity}</TableCell>
                      <TableCell>{invoice.unitPrice}</TableCell>
                      <TableCell>{invoice.totalPrice}</TableCell>
                      <TableCell>{invoice.taxRate}</TableCell>
                      <TableCell>{invoice.invoiceStatus}</TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toISOString().split("T")[0]}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center" }}
                        style={{ display: "flex" }}
                      >
                        {/* <IconButton
                          color="primary"
                          onClick={() => handleViewDialogOpen(invoice)}
                        >
                          <VisibilityIcon />
                        </IconButton> */}
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
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </TableContainer>
      ) : (
        <Typography align="center" sx={{ marginTop: 2 }}>
          No results found
        </Typography>
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

      {/* Add/Edit Invoice Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {mode === "add" ? "Add Tax Invoice" : "Edit Tax Invoice"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Invoice No"
                name="invoiceNo"
                value={newInvoice.invoiceNo}
                onChange={handleInputChange}
                fullWidth
                disabled={mode === "edit"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Work Order No"
                name="workOrderNo"
                value={newInvoice.workOrderNo}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                value={newInvoice.invoiceDate}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Item Description"
                name="itemDescription"
                value={newInvoice.itemDescription}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Quantity"
                name="quantity"
                value={newInvoice.quantity}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Unit Price"
                name="unitPrice"
                value={newInvoice.unitPrice}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total Price"
                name="totalPrice"
                value={newInvoice.totalPrice}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tax Rate"
                name="taxRate"
                value={newInvoice.taxRate}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Invoice Status"
                name="invoiceStatus"
                value={newInvoice.invoiceStatus}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={newInvoice.dueDate}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={mode === "add" ? handleAddInvoice : handleEditInvoice}
            color="primary"
          >
            {mode === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>View Tax Invoice</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <DialogContentText>
              <pre>{JSON.stringify(selectedInvoice, null, 2)}</pre>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Invoice Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        sx={{ padding: "20px" }}
      >
        <DialogTitle>Delete Tax Invoice</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button
            color="error"
            onClick={handleDelete}
            sx={{ color: "#ff0000" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxInvoiceTable;
