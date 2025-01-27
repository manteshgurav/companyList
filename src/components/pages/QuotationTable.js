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
import jsPDF from "jspdf"; // PDF Export Library
import { utils, writeFile } from "xlsx"; // Excel Export Library
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Import PDF icon
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone"; // Import Excel icon
import { Email as EmailIcon } from "@mui/icons-material"; // Add Email icon

const API_URL = "https://km-enterprices.onrender.com/quotations";

const TaxInvoiceTable = () => {
  const [tableData, setTableData] = useState([]);
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
    companyName: "",
    date: "",
    description: "",
    unit: "",
    rate: "",
    total: "",
  });
  const [invoiceData, setInvoiceData] = useState(null);

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
      companyName: "",
      date: "",
      description: "",
      unit: "",
      rate: "",
      total: "",
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
  const handleGmailOpen = (invoice) => {
    setDialogGmailpen(true);
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
        showSnackbar("Quotation updated successfully!", "success");
      } else {
        const errorData = await response.json();
        showSnackbar(
          `Failed to update Quotation: ${errorData.message}`,
          "error"
        );
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update data:", error);
      showSnackbar("Error updating Quotation.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
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
    doc.text(`Company: ${invoice.companyName}`, 10, 30);
    doc.text(`Date: ${format(new Date(invoice.date), "dd-MM-yyyy")}`, 10, 40);
    doc.text(`Description: ${invoice.description}`, 10, 50);
    doc.text(`Unit: ${invoice.unit}`, 10, 60);
    doc.text(`Rate: ${invoice.rate}`, 10, 70);
    doc.text(`Total: ${invoice.total}`, 10, 80);

    // Add a footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("KM Enterprises", 10, 10);
    doc.text(
      "===========================================================",
      10,
      10
    );

    doc.text(
      `Page ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF with the file name
    doc.save(`${invoice.companyName}_Invoice.pdf`);
  };

  const exportToExcel = (invoice) => {
    const worksheet = utils.json_to_sheet([invoice]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Invoice");
    writeFile(workbook, `${invoice.companyName}_Invoice.xlsx`);
  };

  const columns = [
    { id: "companyName", label: "Company Name" },
    { id: "date", label: "Date" },
    { id: "description", label: "Description" },
    { id: "unit", label: "Unit" },
    { id: "rate", label: "Rate" },
    { id: "total", label: "Total" },
  ];

  const filteredData = tableData.filter((invoice) => {
    return Object.values(invoice)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const sendEmail = () => {
    // Logic to send PDF and Excel files via email
    const email = gmail; // Replace with the actual email input from the user or a predefined email
    const subject = `Quotation for ${invoiceData.companyName}`;
    const body = `Please find attached the PDF and Excel files for the quotation.\n\nDate: ${invoiceData.date}\nDescription: ${invoiceData.description}`;

    // Trigger mailto link to open the default email client with attachments (Note: mailto does not support attachments)
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open the user's email client with the pre-filled details
    window.location.href = mailtoLink;
    setDialogGmailpen(false);
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
              Add Quotation
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
                    <TableCell>{invoice.companyName}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.date), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{invoice.unit}</TableCell>
                    <TableCell>{invoice.rate}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      style={{ display: "flex" }}
                    >
                      {/* <IconButton
                      onClick={() => {
                        setInvoiceData(invoice);
                        handleGmailOpen();
                      }}
                      color="primary"
                    >
                      <EmailIcon />
                    </IconButton> */}
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
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {mode === "add" ? "Add Quotation" : "Edit Quotation"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                name="companyName"
                value={newInvoice.companyName}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                value={newInvoice.date} // Properly formatted date for input
                onChange={handleInputChange}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={newInvoice.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Unit"
                name="unit"
                value={newInvoice.unit}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Rate"
                name="rate"
                value={newInvoice.rate}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total"
                name="total"
                value={newInvoice.total}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={mode === "add" ? handleAddInvoice : handleEditInvoice}
          >
            {mode === "add" ? "Add" : "Save"}
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
          {"Delete this Quotation?"}
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
        <DialogTitle>View Quotation</DialogTitle>
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
