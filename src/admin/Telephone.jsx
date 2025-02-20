import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Form, Container, Row, Col } from "react-bootstrap";
import ConnectMe from "../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import showToast from "../utils/toastHelper";

const ExcelUploader = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  // Fetch data from API
  const fetchDataFromAPI = async (page = 1) => {
    try {
      const url = `${ConnectMe.BASE_URL}/telecom/fetch-data?page=${page}&limit=${pagination.limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const filteredColumns = Object.keys(response.data.data[0]).filter(col => col !== "_id" && col !== "__v");

        setColumns(filteredColumns);
        setData(response.data.data);
        setPagination({
          totalRecords: response.data.pagination.totalRecords,
          totalPages: response.data.pagination.totalPages,
          currentPage: page,
          limit: pagination.limit,
        });
      } else {
        showToast("No data available.", "error");
      }
    } catch (error) {
      showToast("Error fetching data.", "error");
    }
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      if (parsedData.length > 0) {
        const filteredColumns = Object.keys(parsedData[0]).filter(col => col !== "_id" && col !== "__v");
        setColumns(filteredColumns);
      }

      const formattedData = parsedData.map(row => ({
        ...row,
        isNew: true,
      }));

      setData(formattedData);
    };
  };

  // ✅ Updated `handleAddRow` to ensure new empty row appears
  const handleAddRow = () => {
    if (columns.length === 0) {
      showToast("Please upload a file first!", "warning");
      return;
    }

    const emptyRow = columns.reduce((acc, key) => ({ ...acc, [key]: "", isNew: true, isEditing: true }), {});

    setData((prevData) => [...prevData, emptyRow]);
  };

  // Handle Delete Row
  const handleDeleteRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  // Handle Save Data
  const handleSave = async () => {
    try {
      const updatedData = data.filter(row => row.isNew || row.isUpdated);

      if (updatedData.length === 0) {
        showToast("No changes detected.", "info");
        return;
      }

      const url = `${ConnectMe.BASE_URL}/telecom/save-data`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("POST", url, headers, { data: updatedData });

      if (response.success) {
        showToast("Data saved successfully!", "success");
        setData(prevData => prevData.map(row => ({ ...row, isNew: false, isUpdated: false })));
      } else {
        showToast("Failed to save data.", "error");
      }
    } catch (error) {
      showToast("Error saving data.", "error");
    }
  };

  // Handle Pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchDataFromAPI(page);
  };

  useEffect(() => {
    fetchDataFromAPI(pagination.currentPage);
  }, [pagination.currentPage]);

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Excel Uploader</h3>
      <Row className="mb-3">
        <Col>
          <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

      {columns.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {row.isEditing ? (
                        <Form.Control
                          type="text"
                          value={row[col] || ""}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[rowIndex] = { ...newData[rowIndex], [col]: e.target.value };
                            setData(newData);
                          }}
                        />
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}

                  {/* Actions Column */}
                  <td style={{ display: "flex", gap: "5px" }}>
                    <Button
                      variant={row.isEditing ? "success" : "primary"}
                      size="sm"
                      onClick={() => {
                        const newData = [...data];
                        newData[rowIndex].isEditing = !newData[rowIndex].isEditing;
                        setData(newData);
                      }}
                    >
                      {row.isEditing ? "💾" : "✏️"}
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRow(rowIndex)}
                      disabled={row.isEditing}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <Row className="mt-3">
            <Col>
              <Button variant="secondary" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
                Previous
              </Button>
              <span className="mx-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button variant="secondary" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
                Next
              </Button>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button variant="primary" onClick={handleAddRow}>➕ Add Row</Button>
              <Button variant="success" className="ms-2" onClick={handleSave}>💾 Save Data</Button>
            </Col>
          </Row>
        </>
      ) : (
        <p className="text-center">No data uploaded. Please upload an Excel file.</p>
      )}
    </Container>
  );
};

export default ExcelUploader;
