import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../../../lib/firebase/init";

function TambahStrukturOrganisasi() {
  const [no, setNo] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        setSession(userSession);
      } else {
        window.location.href = "/login";
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore(app);
    try {
      const docRef = await addDoc(collection(db, "StrukturOrganisasi"), {
        no,
        nama,
        jabatan,
      });
      console.log("Document written with ID: ", docRef.id);
      setNo("");
      setNama("");
      setJabatan("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setShowErrorModal(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <LayoutAdmin>
      <div>
        <h2 className="text-lg md:text-2xl font-semibold p-4">Tambah Struktur Organisasi</h2>
      </div>
      <div className="flex justify-center items-center p-5">
        <form className="max-w-3xl mx-auto bg-gray-200 shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="no"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                No
              </label>
              <input
                type="text"
                id="no"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukan No"
                required
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="nama"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama
              </label>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukan Nama"
                required
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="jabatan"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Jabatan
              </label>
              <input
                type="text"
                id="jabatan"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukan Jabatan"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Upload berhasil!</h2>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5"
              onClick={() => setShowSuccessModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Upload gagal!</h2>
              <p className="text-sm text-gray-700">{errorMessage}</p>
            </div>
            <div className="bg-gray-100 p-4 flex justify-center">
              <button
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2.5"
                onClick={() => setShowErrorModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default TambahStrukturOrganisasi;
