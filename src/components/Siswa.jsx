import React, { useState, useEffect } from "react";
import Layout from "../page/Layout";
import { retrieveData, uploadData } from "../lib/firebase/service";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import app from "../lib/firebase/init";

const firestore = getFirestore(app);

function Siswa() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState();
  const [paginatedData, setPaginatedData] = useState([]); // Define paginatedData state

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


  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const json = JSON.parse(e.target.result);
          for (const item of json) {
            await addDoc(collection(firestore, "Siswa"), item);
          }
          console.log("Data uploaded successfully!");
          fetchData();
          setUploadMessage("Upload berhasil!");
          setTimeout(() => {
            setUploadMessage("");
          }, 3000);
        };
        reader.readAsText(file);
      } else {
        console.error("Please select a file to upload.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Upload gagal.");
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

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage, selectedTahun]);

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
        <div className="px-2 block mx-auto max-w-7xl mt-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <div className="relative overflow-x-auto mt-4">
            <div className="flex justify-end items-center px-3 pb-3">
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

            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-700 dark:text-gray-600">
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-red-00">
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
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-2 py-2">{item.no}</td>
                    <td className="px-2 py-2">{item.nama}</td>
                    <td className="px-2 py-2">{item.jeniskelamin}</td>
                    <td className="px-2 py-2">{item.rayon}</td>
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
      <div className="flex justify-center items-center mt-5">
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button
          className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleUpload}
        >
          Upload JSON
        </button>
        {uploadMessage && (
          <p className="ml-3 text-green-500">{uploadMessage}</p>
        )}
      </div>
    </Layout>
  );
}

export default Siswa;
