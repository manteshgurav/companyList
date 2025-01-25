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

const API_URL = "http://localhost:5000/quotations";

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
    companyName: "",
    date: "",
    description: "",
    unit: "",
    rate: "",
    total: "",
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
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewDialogOpen(invoice)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDialogOpenEdit(invoice)}
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteDialogOpen(invoice)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        <DialogTitle>View Quotation</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <div>
              <Typography variant="h6">
                Company Name: {selectedInvoice.companyName}
              </Typography>
              <Typography variant="body1">
                Date: {format(new Date(selectedInvoice.date), "dd-MM-yyyy")}
              </Typography>
              <Typography variant="body1">
                Description: {selectedInvoice.description}
              </Typography>
              <Typography variant="body1">
                Unit: {selectedInvoice.unit}
              </Typography>
              <Typography variant="body1">
                Rate: {selectedInvoice.rate}
              </Typography>
              <Typography variant="body1">
                Total: {selectedInvoice.total}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Quotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this quotation?
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

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaxInvoiceTable;
