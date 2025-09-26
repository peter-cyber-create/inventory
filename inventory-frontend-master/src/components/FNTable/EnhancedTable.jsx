import React, { useState, useMemo } from "react";
import { Table, Form, InputGroup, Pagination } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import "./table.css";

const EnhancedTable = ({ data, columns }) => {
  const getNestedValue = (obj, path) => {
    const keys = path.split(".");
    return keys.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""),
      obj
    );
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      columns.some((column) => {
        const value = getNestedValue(item, column.key);
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [sortedData, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return <FaSort />;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderCell = (item, column) => {
    const value = getNestedValue(item, column.key);
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return column.render ? column.render(value, item) : value;
  };

  return (
    <div className="enhanced-bootstrap-table">
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} onClick={() => requestSort(column.key)}>
                  {column.label} {getSortIcon(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{renderCell(item, column)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination> */}
    </div>
  );
};

export default EnhancedTable;
