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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Import PDF icon
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone"; // Import Excel icon
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const API_URL = "https://km-enterprices.onrender.com/siteEntries";

const TaxInvoiceTable = () => {
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    materialIn: "",
    materialOut: "",
    labourEntry: "",
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [mode, setMode] = useState("add");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (Array.isArray(data)) {
        setTableData(data);
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
      materialIn: "",
      materialOut: "",
      labourEntry: "",
    });
    setMode("add");
    setDialogOpen(true);
  };

  const handleDialogOpenEdit = (invoice) => {
    setNewInvoice({
      ...invoice,
      date: new Date(invoice.date).toISOString().split("T")[0], // Format to YYYY-MM-DD
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
    try {
      console.log("Sending PUT request with ID:", newInvoice._id); // Log the ID

      const response = await fetch(`${API_URL}/${newInvoice._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });

      if (response.ok) {
        const updatedInvoice = await response.json(); // Get the updated quotation
        setTableData(
          tableData.map((item) =>
            item._id === newInvoice._id ? updatedInvoice : item
          )
        );
        showSnackbar("labourEntry updated successfully!", "success");
      } else {
        const errorData = await response.json();
        showSnackbar(
          `Failed to update labourEntry: ${errorData.message}`,
          "error"
        );
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update data:", error);
      showSnackbar("Error updating labourEntry.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const columns = [
    { id: "materialIn", label: "Material In" },
    { id: "materialOut", label: "Material Out" },
    { id: "labourEntry", label: "labour Entry" },
  ];

  const filteredData = tableData.filter((invoice) => {
    return Object.values(invoice)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const exportToExcel = (invoice) => {
    // Prepare the data in the format for Excel
    const data = [
      ["Material In", "Material Out", "Labour Entry"], // Headers
      [invoice.materialIn, invoice.materialOut, invoice.labourEntry], // Data row
    ];

    // Create a new workbook
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Create a new workbook object
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Details");

    // Export the data to an Excel file
    XLSX.writeFile(wb, `Invoice_${invoice.invoiceNo}_Details.xlsx`);
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
    doc.text("Material In", 10, 40);
    doc.text("Material Out", 60, 40);
    doc.text("Labour Entry", 110, 40);

    // Table row for the data
    doc.setTextColor(0, 0, 0); // Reset text color to black for data
    doc.text(`${invoice.materialIn}`, 10, 50);
    doc.text(`${invoice.materialOut}`, 60, 50);
    doc.text(`${invoice.labourEntry}`, 110, 50);

    // Add a line under the content
    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    // Footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(
      `Page ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF with the file name
    doc.save(`Invoice_${invoice.invoiceNo}_Details.pdf`);
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
              Add Site Entry
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
                      {/* Material In Column */}
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {invoice.materialIn}
                      </TableCell>
                      {/* Material Out Column */}
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {invoice.materialOut}
                      </TableCell>
                      {/* Labour Entry Column */}
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        {invoice.labourEntry}
                      </TableCell>
                      {/* Actions Column */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "8px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {/* PDF Export Icon */}
                        <IconButton
                          onClick={() => exportToPDF(invoice)}
                          color="primary"
                          sx={{ fontSize: "20px" }}
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
                        {/* Excel Export Icon */}
                        <IconButton
                          onClick={() => exportToExcel(invoice)}
                          color="primary"
                          sx={{ fontSize: "20px" }}
                        >
                          <FileDownloadDoneIcon />
                        </IconButton>
                        {/* Edit Icon */}
                        <IconButton
                          color="secondary"
                          onClick={() => handleDialogOpenEdit(invoice)}
                          sx={{ fontSize: "20px" }}
                        >
                          <EditIcon />
                        </IconButton>
                        {/* Delete Icon */}
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteDialogOpen(invoice)}
                          sx={{ fontSize: "20px" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
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
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {mode === "add" ? "Add New labourEntry" : "Edit labourEntry"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === "add"
              ? "Please fill out the form below to add a new labour Entry."
              : "Edit the details of the tax labour Entry."}
          </DialogContentText>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ width: "100%", paddingTop: 2 }}
          >
            <TextField
              label="Material In"
              variant="outlined"
              fullWidth
              margin="normal"
              name="materialIn"
              value={newInvoice.materialIn}
              onChange={handleInputChange}
            />
            <TextField
              label="Material Out"
              variant="outlined"
              fullWidth
              margin="normal"
              name="materialOut"
              value={newInvoice.materialOut}
              onChange={handleInputChange}
            />
            <TextField
              label="labour Entry"
              variant="outlined"
              fullWidth
              margin="normal"
              name="labourEntry"
              value={newInvoice.labourEntry}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={mode === "add" ? handleAddInvoice : handleEditInvoice}
            color="primary"
          >
            {mode === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>View labour Entry</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Material In:</strong> {selectedInvoice?.materialIn}
          </Typography>
          <Typography variant="body1">
            <strong>Material Out:</strong> {selectedInvoice?.materialOut}
          </Typography>
          <Typography variant="body1">
            <strong>labour Entry:</strong> {selectedInvoice?.labourEntry}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete labourEntry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this labour Entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxInvoiceTable;
