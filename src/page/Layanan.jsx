import React, { useState } from "react";
import Layout from "./Layout";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import app from "../lib/firebase/init";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const firestore = getFirestore(app);

function Layanan() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const newData = {
        nama: nama,
        noTelepon: noTelepon,
        alamat: alamat,
        deskripsi: deskripsi,
      };
      await addDoc(collection(firestore, "Layanan"), newData);
      console.log("Layanan added successfully!");
      setSuccessMessage("Layanan berhasil ditambahkan.");
      setErrorMessage("");
      setShowModal(true);
      setNama("");
      setNoTelepon("");
      setAlamat("");
      setDeskripsi("");
    } catch (error) {
      console.error("Error adding layanan:", error);
      setErrorMessage("Gagal menambahkan layanan. Silakan coba lagi.");
      setSuccessMessage("");
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setShowModal(false);
      setSuccessMessage("");
      setErrorMessage("");
    }, 500);
  };

  return (
    <Layout>
      <div className="pt-20 text-center">
        <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-5">
          LAYANAN
        </div>
        <div className="flex justify-center pt-5 pb-10 md:pb-20">
          <div className="max-w-4xl px-6  rounded-lg">
            <p className="text-sm md:text-lg text-black text-justify ">
              "Selamat datang di Layanan Persaudaraan Setia Hati Terate (PSHT)
              Ranting Gondang. Kami hadir untuk membantu Anda berbagi pengaduan,
              saran, atau pengalaman Anda dengan kami. Tim kami selalu siap
              mendengarkan dan mempertimbangkan setiap pengaduan yang diberikan
              untuk terus meningkatkan kualitas layanan kami."
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-10 px-6 md:px-10 rounded-lg md:max-w-7xl">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          {/* Input Nama */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nama"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Nama
            </label>
            <input
              {...register("nama", { required: true })}
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => handleInputChange(e, setNama)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan nama"
            />
            {errors.nama && (
              <p className="text-red-500 text-xs mt-1">Nama harus diisi</p>
            )}
          </div>

          {/* Input Nomor Telepon */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="telepon"
            >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Nomor Telepon
            </label>
            <input
              {...register("telepon", { required: true })}
              id="telepon"
              type="tel"
              value={noTelepon}
              onChange={(e) => handleInputChange(e, setNoTelepon)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan nomor telepon"
            />
            {errors.telepon && (
              <p className="text-red-500 text-xs mt-1">
                Nomor telepon harus diisi
              </p>
            )}
          </div>

          {/* Input Alamat */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="alamat"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Alamat
            </label>
            <input
              {...register("alamat", { required: true })}
              id="alamat"
              type="text"
              value={alamat}
              onChange={(e) => handleInputChange(e, setAlamat)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan alamat"
            />
            {errors.alamat && (
              <p className="text-red-500 text-xs mt-1">Alamat harus diisi</p>
            )}
          </div>

          {/* Input Deskripsi */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="deskripsi"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Deskripsi
            </label>
            <textarea
              {...register("deskripsi", { required: true })}
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => handleInputChange(e, setDeskripsi)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan deskripsi"
            ></textarea>
            {errors.deskripsi && (
              <p className="text-red-500 text-xs mt-1">Deskripsi harus diisi</p>
            )}
          </div>

          {/* Tombol Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-md relative">
            <button onClick={closeModal} className="absolute top-0 right-0 p-2">
              &times;
            </button>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
      {/* End of Modal */}
    </Layout>
  );
}

export default Layanan;
