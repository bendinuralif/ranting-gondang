import React, { useState, useEffect } from 'react';
import Layout from '../page/Layout';
import { retrieveData } from "../lib/firebase/service";
import { useDebounce } from "use-debounce";

function SubRayon() {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter(
      (item) =>
        item.sub.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.rayon.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    setTotalDataCount(filteredData.length);
    const totalPagesCount = Math.ceil(filteredData.length / rowsPerPage);
    setTotalPages(totalPagesCount);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [data, debouncedSearchQuery, currentPage, rowsPerPage]);

  const fetchData = async () => {
    try {
      const res = await retrieveData('SubRayon');
      const sortedData = res.sort((a, b) => a.rayon.localeCompare(b.rayon));
      setData(sortedData);
      setTotalDataCount(sortedData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="pt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold pt-10 text-gray-800">
          SUB RAYON RANTING GONDANG
        </h2>
        <h3 className="text-xl md:text-3xl font-medium pb-5 text-gray-600">
          CABANG SRAGEN
        </h3>
      </div>
      <div className="flex justify-center items-center px-5">
        <div className="w-full max-w-7xl mt-10 mb-10 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="relative overflow-x-auto mt-4 p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="mr-2 font-medium">Total: {totalDataCount}</span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="border rounded-lg px-3 py-2 focus:ring focus:ring-red-200 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  <th scope="col" className="px-4 py-3">Sub</th>
                  <th scope="col" className="px-4 py-3">Rayon</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 dark:hover:bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700`}>
                    <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3">{item.sub}</td>
                    <td className="px-4 py-3">{item.rayon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <div>
                <label htmlFor="rowsPerPage" className="mr-2 font-medium">Rows per page:</label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border rounded px-3 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={data.length}>All</option>
                </select>
              </div>
              <div className="flex items-center">
              <button
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === 1 ? "cursor-not-allowed bg-gray-300" : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-gray-600 dark:text-gray-400 mx-5">
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
    </Layout>
  );
}

export default SubRayon;
