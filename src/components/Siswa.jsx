import React, { useState, useEffect } from "react";
import Layout from "../page/Layout";
import { retrieveData } from "../lib/firebase/service";

function Siswa() {
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
      const res = await retrieveData("Siswa");
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
          SISWA RANTING GONDANG
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
                
<form class="max-w-lg mx-auto">
    <div class="flex">
        <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
        <button id="dropdown-button" data-dropdown-toggle="dropdown" class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">All categories <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
        <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
            <li>
                <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Nama</button>
            </li>
            <li>
                <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Jenis Kelamin</button>
            </li>
            <li>
                <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rayon</button>
            </li>
            </ul>
        </div>
        <div class="relative w-full">
            <input type="search" id="search-dropdown" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required />
            <button type="submit" class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
                <span class="sr-only">Search</span>
            </button>
        </div>
    </div>
</form>

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
                    Rayon
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className={`bg-${
                      index % 2 === 0 ? "gray-100" : "white"
                    } border-b dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <td className="px-2 py-2">{item.no}</td>
                    <td className="px-2 py-2">{item.nama}</td>
                    <td className="px-2 py-2">{item.jeniskelamin}</td>
                    <td className="px-2 py-2">{item.rayon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center px-3 py-2">
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
          <div className="flex justify-end items-start p-4">
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
                  currentPage === totalPages
                    ? "cursor-not-allowed"
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
    </Layout>
  );
}

export default Siswa;
