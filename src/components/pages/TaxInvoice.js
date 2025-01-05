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
    setNewInvoice(invoice);
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
              <TableRow>
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
                        {
                          new Date(invoice.invoiceDate)
                            .toISOString()
                            .split("T")[0]
                        }
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
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDialogOpen(invoice)}
                        >
                          <VisibilityIcon />
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
