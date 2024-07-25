import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import Layout from "../page/Layout";
import { retrieveData } from "../lib/firebase/service";

function Warga() {
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState("Semua");
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Fetch data only when necessary
  const fetchData = useCallback(async () => {
    try {
      const res = await retrieveData("Warga");
      const availableYears = ["Semua", ...Array.from(new Set(res.map((item) => item.tahun))).sort((a, b) => b - a)];
      setTahunOptions(availableYears);
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filteredData = selectedTahun === "Semua"
      ? data
      : data.filter((item) => item.tahun === selectedTahun);

    const searchData = filteredData.filter((item) =>
      (item.nama || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (item.jeniskelamin || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (item.alamat || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    const sortedData = searchData.sort((a, b) => {
      if (typeof a.no === "string" && typeof b.no === "string") {
        return a.no.localeCompare(b.no);
      } else {
        return a.no - b.no;
      }
    });

    const totalPagesCount = Math.ceil(sortedData.length / rowsPerPage);
    setTotalPages(totalPagesCount);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(sortedData.slice(startIndex, endIndex));
    setTotalDataCount(searchData.length);
  }, [data, selectedTahun, debouncedSearchQuery, currentPage, rowsPerPage]);

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
    setSelectedTahun(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
                <span className="text-gray-700 dark:text-gray-300">Total: {totalDataCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="search"
                  onChange={handleSearch}
                  value={searchQuery}
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
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 dark:hover:bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.jeniskelamin}</td>
                    <td className="px-4 py-3">{item.alamat}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="rowsPerPage" className="text-gray-700 dark:text-gray-300">
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
              <div className="flex items-center space-x-2">
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
        </div>
      </div>
      <div className="mb-5"></div>
    </Layout>
  );
}

export default Warga;
