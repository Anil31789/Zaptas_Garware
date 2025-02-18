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
  
      console.log("API Response: ", response);
  
      if (response.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const filteredColumns = Object.keys(response.data.data[0]).filter(col => col !== "_id" && col !== "__v");
  
        setColumns(filteredColumns); // Set columns excluding _id and __v
        setData(response.data.data);
        setPagination((prevState) => ({
          ...prevState,
          totalRecords: response.data.pagination.totalRecords,
          totalPages: response.data.pagination.totalPages,
          currentPage: page,
        }));
      } else {
        showToast("No data available or failed to fetch data.", "error");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      showToast("An error occurred while fetching data.", "error");
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
  
      // Mark all uploaded data as new
      const formattedData = parsedData.map(row => {
        const { _id, __v, ...filteredRow } = row;
        return { ...filteredRow, isNew: true }; // Ensure isNew flag is added
      });
  
      setData(formattedData);
    };
  };
  

  // Handle Add Row
  const handleAddRow = () => {
    if (columns.length === 0) {
      showToast("Please upload a file first!", "warning");
      return;
    }
  
    // Create an empty row with 'isNew' flag
    const emptyRow = columns.reduce((acc, key) => ({ ...acc, [key]: "", isNew: true }), {});
  
    // Update pagination state
    const totalRecords = pagination.totalRecords + 1;
    const totalPages = Math.ceil(totalRecords / pagination.limit);
    let newPage = pagination.currentPage;
  
    // If the current page is the last page and it has space, stay on the current page
    if (pagination.currentPage === totalPages && totalRecords <= pagination.limit * pagination.currentPage) {
      newPage = pagination.currentPage;
    } else {
      // Otherwise, move to the last page
      newPage = totalPages;
    }
  
    setPagination((prevState) => ({
      ...prevState,
      totalRecords,
      totalPages,
      currentPage: newPage,
    }));
  
    // Append the new row to the data
    setData((prevData) => {
      // If adding on a new page, don't modify the current page's data
      if (newPage !== pagination.currentPage) {
        return prevData;
      }
      return [...prevData, emptyRow];
    });
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
  
        // Reset flags after saving
        setData(prevData => prevData.map(row => ({ ...row, isNew: false, isUpdated: false })));
      } else {
        showToast("Failed to save data.", "error");
      }
    } catch (error) {
      console.error("Error saving data", error);
      showToast("An error occurred while saving data.", "error");
    }
  };
  

  // Filter data based on search query
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      row[col] ? row[col].toString().toLowerCase().includes(searchQuery.toLowerCase()) : false
    )
  );

  // Pagination controls
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return; // Prevent invalid page numbers
    fetchDataFromAPI(page); // Fetch data for the selected page
  };

  useEffect(() => {
    fetchDataFromAPI(pagination.currentPage); // Fetch data on initial load
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
                  <th key={index}>
                    {col}{" "}
                    {/* <Button variant="danger" size="sm" onClick={() => handleDeleteColumn(col)}>
                      ❌
                    </Button> */}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      <Form.Control
                        type="text"
                        value={row[col] || ""}
                        onChange={(e) => {
                            const newData = [...data];
                            newData[rowIndex] = { ...newData[rowIndex], [col]: e.target.value, isUpdated: true };
                            setData(newData);
                        }}
                      />
                    </td>
                  ))}
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteRow(rowIndex)}>
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
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="mx-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button variant="primary" onClick={handleAddRow}>
                ➕ Add Row
              </Button>
              <Button variant="success" className="ms-2" onClick={handleSave}>
                💾 Save Data
              </Button>
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
