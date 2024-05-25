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
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage, searchQuery]);

  return (
    <Layout>
      <div className="pt-20">
        <div className="text-lg md:text-2xl font-semibold pt-10 text-center">
          DATA WARGA RANTING GONDANG
        </div>
        <div className="text-lg md:text-2xl font-semibold pb-5 text-center">
          CABANG SRAGEN
        </div>
      </div>
      <div className="justify-center items-center px-5">
        <div className="px-2 block mx-auto max-w-7xl mt-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="relative overflow-x-auto mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center px-3 pb-3 space-y-3 md:space-y-0">
              <div className="flex items-center">
                <label htmlFor="tahun" className="mr-2">
                  Pilih Tahun:
                </label>
                <select
                  id="tahun"
                  onChange={handleChangeTahun}
                  value={selectedTahun}
                  className="border rounded px-3 py-1"
                >
                  {tahunOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label htmlFor="search" className="mr-2">
                  Search:
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border rounded px-3 py-1"
                  placeholder="Search by nama"
                />
              </div>
            </div>
            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-700 dark:text-gray-600">
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-red-00">
                <tr>
                  <th scope="col" className="px-2 py-2">
                    No
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Nama
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Jenis Kelamin
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Alamat
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Tahun
                  </th>
                </tr>
              </thead>
              <tbody>
              {paginatedData.map((item, index) => (
  <tr
    key={index}
    className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} border-b dark:bg-gray-800 dark:border-gray-700`}
  >
    <td className="px-2 py-2">{item.no}</td>
    <td className="px-2 py-2">{item.nama}</td>
    <td className="px-2 py-2">{item.jeniskelamin}</td>
    <td className="px-2 py-2">{item.alamat}</td>
    <td className="px-2 py-2">{item.tahun}</td>
  </tr>
))}

              </tbody>
            </table>
            <div className="flex justify-end items-center px-3">
              <label htmlFor="rowsPerPage" className="mr-2">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                onChange={handleChangeRowsPerPage}
                value={rowsPerPage}
                className="border rounded px-3 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end items-start  p-4">
            <div>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  currentPage === 1
                    ? "cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="mx-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  currentPage === totalPages                    ? "cursor-not-allowed"
                  : "bg-red-500 text-white"
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end items-start  p-4 mt-5"></div>

  </Layout>
);
}

export default Warga;

