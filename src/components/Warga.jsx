import React, { useState, useEffect } from "react";
import Layout from "../page/Layout";
import { retrieveData } from "../lib/firebase/service";

function Warga() {
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState();
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedTahun]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  const fetchData = async () => {
    try {
      const res = await retrieveData("Warga");
      const availableYears = Array.from(new Set(res.map((item) => item.tahun))).sort((a, b) => b - a);
      setTahunOptions(availableYears);

      if (!selectedTahun && availableYears.length > 0) {
        setSelectedTahun(availableYears[0]);
      }

      const filteredData = selectedTahun ? res.filter((item) => item.tahun == selectedTahun) : res;

      const filteredAndSortedData = filteredData.filter(
        (item) => typeof item.no === "string" || typeof item.no === "number"
      );
      const sortedData = filteredAndSortedData.sort((a, b) => {
        if (typeof a.no === "string" && typeof b.no === "string") {
          return a.no.localeCompare(b.no);
        } else {
          return a.no - b.no;
        }
      });

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleChangeTahun = (e) => {
    const selectedYear = e.target.value;
    setSelectedTahun(selectedYear);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jeniskelamin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage, searchQuery]);

  return (
    <Layout>
      <div className="pt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold pt-10 text-gray-800">
          DATA WARGA RANTING GONDANG
        </h2>
        <h3 className="text-xl md:text-3xl font-medium pb-5 text-gray-600">
          CABANG SRAGEN
        </h3>
      </div>
      <div className="flex justify-center items-center px-5">
        <div className="w-full max-w-7xl mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="relative overflow-x-auto mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 pb-4 space-y-3 md:space-y-0">
              <div className="flex items-center space-x-2">
                <label htmlFor="tahun" className="text-gray-700 dark:text-gray-300">
                  Pilih Tahun:
                </label>
                <select
                  id="tahun"
                  onChange={handleChangeTahun}
                  value={selectedTahun}
                  className="border rounded-lg px-3 py-2 focus:ring focus:ring-red-200 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tahunOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border rounded-lg px-3 py-2 focus:ring focus:ring-red-200 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Search..."
                />
              </div>
            </div>
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Jenis Kelamin
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Alamat
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tahun
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className={`bg-${index % 2 === 0 ? "gray-100" : "white"} border-b dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.jeniskelamin}</td>
                    <td className="px-4 py-3">{item.alamat}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center px-4 py-4">
              <label htmlFor="rowsPerPage" className="mr-2 text-gray-700 dark:text-gray-300">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                onChange={handleChangeRowsPerPage}
                value={rowsPerPage}
                className="border rounded-lg px-3 py-2 focus:ring focus:ring-red-200 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center p-4">
            <button
              className={`px-3 py-2 rounded-lg ${
                currentPage === 1 ? "cursor-not-allowed bg-gray-300" : "bg-red-500 text-white hover:bg-red-600"
              }`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-3 py-2 rounded-lg ${
                currentPage === totalPages ? "cursor-not-allowed bg-gray-300" : "bg-red-500 text-white hover:bg-red-600"
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="mb-5"></div>
    </Layout>
  );
}

export default Warga;
