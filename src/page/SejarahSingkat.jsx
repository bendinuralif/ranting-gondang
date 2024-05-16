import Layout from "./Layout";
import galeri1 from "../assets/img/sejarah-1.jpg";
import galeri2 from "../assets/img/sejarah-2.png";
import galeri3 from "../assets/img/sejarah-3.jpg";
import React, { useState, useEffect } from "react";
import { retrieveData, uploadData } from "../lib/firebase/service";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import app from '../lib/firebase/init'; // Sesuaikan dengan lokasi file konfigurasi Firebase Anda

function SejarahSingkat() {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await retrieveData('Sejarah');
          const sortedData = res.sort((a, b) => {
            if (typeof a.no === "string" && typeof b.no === "string") {
              return a.no.localeCompare(b.no);
            } else {
              return a.no - b.no;
            }
          });
          setData(sortedData);
          console.log(sortedData); // Cetak data yang diterima dari Firebase setelah diurutkan
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData(); // Panggil fungsi fetchData saat komponen dimount
    }, []); // [] artinya useEffect hanya dipanggil sekali saat komponen dimount

  return (
    <div>
      <Layout>
        <div className="pt-20 text-center">
          <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-">
            SEJARAH SINGKAT
          </div>
        </div>

        {/* Bagian pertama */}
        <div className="font-inter text-[1.2rem] md:text-4xl font-bold pt-10 md:pt-20 pl-4 text-center">
          PERSAUDARAAN SETIA HATI TERATE
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center m-5 ">
          <div className="md:w-1/2 flex justify-center md:items-start">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <img src={galeri1} alt="" />
              <div className="text-[0.6rem] md:text-[1.2rem] text-center mt-1 px-7 italic">
            Kangmas Ir. Edy Asmanto dan Kangmas DR. Ir. M. Taufiq SH., MSc.
          </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <p className="text-sm mb-3 p-5 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              Didirikan di Madiun pada tahun 1922 oleh Ki Hajar Hardjo Oetomo
              (1888 – 1952), seorang pahlawan Perintis Kemerdekaan RI, PSHT
              semula bernama Setia Hati Pemuda Sport Club (SH PSC) yang
              berbentuk organisasi. Nama ini kemudian menjadi Persaudaraan Setia
              Hati “Pemuda Sport Club” dan akhirnya diubah menjadi “Persaudaraan
              Setia Hati Terate” dalam kongres pertama di Madiun, 25 Maret 1951.
              <br />
              <br />
              Perkembangan PSHT tidak terlepas dari jasa beberapa tokoh yang
              turut membesarkan PSHT, diantaranya Bpk. RM Soetomo Mangkudjojo;
              Bpk. Santoso Kartoatmodjo; Bpk. Irsyad; Mas RM. Imam Koesoepangat
              dan Mas KRT Tarmadji Budi Harsono, SE. Beliau-beliaulah yang
              meletakkan berbagai dasar dan memperintis pengembangan PSHT yang
              masih digunakan dan berlaku hingga saat ini. Berkat jasa mereka
              semua, PSHT sejak lama sudah memiliki AD-ART, mendirikan sebuah
              yayasan, mengembangkan PSHT dengan membentuk banyak cabang,
              membangun padepokan sebagai pusat kegiatan PSHT, mendirikan
              koperasi yang kini akan diperluas dengan melibatkan semua anggota
              di seluruh cabang, dan makin dikenalnya PSHT melalui berbagai
              kejuaraan.
              <br />
              <br />
              Kepengurusan yang baru di bawah pimpinan DR. Ir. M. Taufiq SH.,
              MSc. selaku Ketua Umum untuk periode 2021 – 2026, telah menetapkan
              rencana strategis yang digunakan sebagai pedoman bagi seluruh
              pengurus di semua tingkatan. Dibandingkan dengan kepengurusan
              sebelumnya, pada periode ini organisasi PSHT mengalami perubahan
              struktur dan diperluas dengan menambah bidang Pengabdian
              Masyarakat untuk lebih mengorganisir kegiatan-kegiatan PSHT yang
              memberi dampak langsung dan positif terhadap masyarakat.
            </p>
          </div>
        </div>

        {/* Bagian kedua */}
        <div className="flex flex-col md:flex-row justify-between items-center m-5 md:m-5 mt-10">
          <div className="md:w-1/2">
            <div className="font-inter text-[1.2rem] md:text-4xl font-bold pt-10 md:pt-20 pl-4 text-center md:text-justify">
              SEJARAH RANTING GONDANG
            </div>
            <p className="text-sm mb-3 p-5 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              Didirikan di Madiun pada tahun 1922 oleh Ki Hajar Hardjo Oetomo
              (1888 – 1952), seorang pahlawan Perintis Kemerdekaan RI, PSHT
              semula bernama Setia Hati Pemuda Sport Club (SH PSC) yang
              berbentuk organisasi. Nama ini kemudian menjadi Persaudaraan Setia
              Hati “Pemuda Sport Club” dan akhirnya diubah menjadi “Persaudaraan
              Setia Hati Terate” dalam kongres pertama di Madiun, 25 Maret 1951.
              <br />
              <br />
              Perkembangan PSHT tidak terlepas dari jasa beberapa tokoh yang
              turut membesarkan PSHT, diantaranya Bpk. RM Soetomo Mangkudjojo;
              Bpk. Santoso Kartoatmodjo; Bpk. Irsyad; Mas RM. Imam Koesoepangat
              dan Mas KRT Tarmadji Budi Harsono, SE. Beliau-beliaulah yang
              meletakkan berbagai dasar dan memperintis pengembangan PSHT yang
              masih digunakan dan berlaku hingga saat ini. Berkat jasa mereka
              semua, PSHT sejak lama sudah memiliki AD-ART, mendirikan sebuah
              yayasan, mengembangkan PSHT dengan membentuk banyak cabang,
              membangun padepokan sebagai pusat kegiatan PSHT, mendirikan
              koperasi yang kini akan diperluas dengan melibatkan semua anggota
              di seluruh cabang, dan makin dikenalnya PSHT melalui berbagai
              kejuaraan.
              <br />
              <br />
              Kepengurusan yang baru di bawah pimpinan DR. Ir. M. Taufiq SH.,
              MSc. selaku Ketua Umum untuk periode 2021 – 2026, telah menetapkan
              rencana strategis yang digunakan sebagai pedoman bagi seluruh
              pengurus di semua tingkatan. Dibandingkan dengan kepengurusan
              sebelumnya, pada periode ini organisasi PSHT mengalami perubahan
              struktur dan diperluas dengan menambah bidang Pengabdian
              Masyarakat untuk lebih mengorganisir kegiatan-kegiatan PSHT yang
              memberi dampak langsung dan positif terhadap masyarakat.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <img src={galeri2} alt="" />
              <div className="text-[0.6rem] md:text-[1.2rem] text-center mt-1 px-7 italic">
            Foto Bersama Tes Sabuk Jambon ke Hijau tahun 2024
          </div>
            </div>
          </div>
        </div>

        {/* Bagian ketiga */}
        <div className="flex flex-col md:flex-row justify-between items-center m-5 md:m-5 mt-10">
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <img src={galeri3} alt="" />
              <div className="text-[0.6rem] md:text-[1.2rem] text-center mt-1 px-7 italic">
              Padepokan Persaudaraan Setia Hati Terate Ranting Gondang
          </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="font-inter text-lg md:text-3xl font-bold pb-5 md:pb-10 pt-10 md:pt-20 md:pl-10 text-center md:text-left">
              DAFTAR KETUA PSHT RANTING GONDANG
            </div>

            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-700 dark:text-gray-600 mt-4 mb-10 pl-5 pr-5">
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-red-00">
                <tr>
                  <th scope="col" className="pl-9 py-2">
                    No
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Nama
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Tahun
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} border-b dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <td className="pl-10 py-2">{index + 1}</td>
                    <td className="px-2 py-2">{item.nama}</td>
                    <td className="px-2 py-2">{item.tahun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default SejarahSingkat;
