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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import logo from "../../videos/video-2.mp4";

const data = [
  {
    invoiceNo: "INV001",
    workOrderNo: "WO123",
    invoiceDate: "2023-12-25",
    itemDescription: "Laptop",
    quantity: 2,
    unitPrice: 50000,
    totalPrice: 100000,
    taxRate: "18% IGST",
    invoiceStatus: "Paid",
    dueDate: "2024-01-10",
  },
  {
    invoiceNo: "INV002",
    workOrderNo: "WO124",
    invoiceDate: "2023-12-26",
    itemDescription: "Mouse",
    quantity: 5,
    unitPrice: 1000,
    totalPrice: 5000,
    taxRate: "12% CGST+SGST",
    invoiceStatus: "Pending",
    dueDate: "2024-01-15",
  },
];

const TaxInvoiceTable = () => {
  const [tableData, setTableData] = useState(data);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const totalCount = tableData.length;

  useEffect(() => {
    const filteredData = data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    );
    setTableData(filteredData);
    setPage(0);
  }, [search]);

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

  const handleDelete = () => {
    setTableData(
      tableData.filter((item) => item.invoiceNo !== selectedInvoice.invoiceNo)
    );
    setDeleteDialogOpen(false);
  };

  const handleAddInvoice = () => {
    if (
      !newInvoice.invoiceNo ||
      !newInvoice.workOrderNo ||
      !newInvoice.invoiceDate ||
      !newInvoice.itemDescription ||
      !newInvoice.quantity ||
      !newInvoice.unitPrice ||
      !newInvoice.totalPrice ||
      !newInvoice.taxRate ||
      !newInvoice.invoiceStatus ||
      !newInvoice.dueDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    setTableData([...tableData, newInvoice]);
    handleDialogClose();
  };

  const handleEditInvoice = () => {
    const updatedData = tableData.map((item) =>
      item.invoiceNo === newInvoice.invoiceNo ? newInvoice : item
    );
    setTableData(updatedData);
    handleDialogClose();
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
            Showing {tableData.length} Items
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
              onChange={(e) => setSearch(e.target.value)}
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
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <IconButton onClick={() => handleViewDialogOpen(row)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDialogOpenEdit(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteDialogOpen(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {mode === "add" ? "Add New Invoice" : "Edit Invoice"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice No"
                variant="outlined"
                fullWidth
                name="invoiceNo"
                value={newInvoice.invoiceNo}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Work Order No"
                variant="outlined"
                fullWidth
                name="workOrderNo"
                value={newInvoice.workOrderNo}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Date"
                variant="outlined"
                fullWidth
                name="invoiceDate"
                value={newInvoice.invoiceDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Description"
                variant="outlined"
                fullWidth
                name="itemDescription"
                value={newInvoice.itemDescription}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                type="number"
                name="quantity"
                value={newInvoice.quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit Price"
                variant="outlined"
                fullWidth
                type="number"
                name="unitPrice"
                value={newInvoice.unitPrice}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Price"
                variant="outlined"
                fullWidth
                name="totalPrice"
                value={newInvoice.totalPrice}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tax Rate"
                variant="outlined"
                fullWidth
                name="taxRate"
                value={newInvoice.taxRate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Status"
                variant="outlined"
                fullWidth
                name="invoiceStatus"
                value={newInvoice.invoiceStatus}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                variant="outlined"
                fullWidth
                name="dueDate"
                value={newInvoice.dueDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={mode === "add" ? handleAddInvoice : handleEditInvoice}
            color="primary"
          >
            {mode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Typography variant="body1">
                <strong>Invoice No:</strong> {selectedInvoice.invoiceNo}
              </Typography>
              <Typography variant="body1">
                <strong>Work Order No:</strong> {selectedInvoice.workOrderNo}
              </Typography>
              <Typography variant="body1">
                <strong>Invoice Date:</strong> {selectedInvoice.invoiceDate}
              </Typography>
              <Typography variant="body1">
                <strong>Item Description:</strong>{" "}
                {selectedInvoice.itemDescription}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {selectedInvoice.quantity}
              </Typography>
              <Typography variant="body1">
                <strong>Unit Price:</strong> {selectedInvoice.unitPrice}
              </Typography>
              <Typography variant="body1">
                <strong>Total Price:</strong> {selectedInvoice.totalPrice}
              </Typography>
              <Typography variant="body1">
                <strong>Tax Rate:</strong> {selectedInvoice.taxRate}
              </Typography>
              <Typography variant="body1">
                <strong>Invoice Status:</strong> {selectedInvoice.invoiceStatus}
              </Typography>
              <Typography variant="body1">
                <strong>Due Date:</strong> {selectedInvoice.dueDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxInvoiceTable;
