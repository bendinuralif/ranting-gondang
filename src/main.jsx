import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from '../src/page/Home.jsx'
import GalleryPage from './page/GalleryPage.jsx';
import Kegiatan from './page/Kegiatan.jsx';
import Layanan from './page/Layanan.jsx';
import Kontak from './page/Kontak.jsx';
import SejarahSingkat from './page/SejarahSingkat.jsx';
import StrukturOrganisasi from './page/StrukturOrganisasi.jsx';
import Tujuan from './page/Tujuan.jsx';
import Siswa from './components/Siswa.jsx';
import Rayon from './components/Rayon.jsx';
import SubRayon from './components/Subrayon.jsx';
import Pusdiklat from './components/Pusdiklat.jsx';
import Filosofi from './page/Filosofi.jsx';
import Falsafah from './page/Falsafah.jsx';
import Dashboard from './admin/page/dashboard.jsx';
import TambahSiswa from './admin/page/Siswa/Tambah.jsx';
import DetailSiswa from './admin/page/Siswa/Detail.jsx';
import DetailSubRayon from './admin/page/SubRayon/Detail.jsx';
import TambahSubRayon from './admin/page/SubRayon/Tambah.jsx';
import LayananAdmin from './admin/page/Layanan.jsx';
import DetailPusdiklat from './admin/page/Pusdiklat/Detail.jsx';
import TambahPusdiklat from './admin/page/Pusdiklat/Tmabah.jsx';
import TambahRayon from './admin/page/Rayon/Tambah.jsx';
import DetailRayon from './admin/page/Rayon/Detail.jsx';
import DetailStrukturOrganisasi from './admin/page/StrukturOrganisasi.jsx/Detail.jsx';
import TambahStrukturOrganisasi from './admin/page/StrukturOrganisasi.jsx/Tambah.jsx';
import DetailSejarahSingkat from './admin/page/SejarahSingkat.jsx/Detail.jsx';
import TambahGaleri from './admin/page/Galeri.jsx/Tambah.jsx';
import DetailGaleri from './admin/page/Galeri.jsx/Detail.jsx';
import Logout from './page/Logout.jsx';
import Login from './page/login.jsx';
import TambahKetuaRanting from './admin/page/SejarahSingkat.jsx/Tambah.jsx';
import UploadData from './admin/page/UploadData.jsx';
import Warga from './components/Warga.jsx';
import KetuaRanting from './components/KetuaRanting.jsx';
import Berita from './page/Berita.jsx';
import TambahWarga from './admin/page/Warga/Tambah.jsx';
import DetailWarga from './admin/page/Warga/Detail.jsx';
import TambahKegiatan from './admin/page/Kegiatan/Tambah.jsx';
import DetailKegiatan from './admin/page/Kegiatan/Detail.jsx';
import DetailBerita from './admin/page/Berita/Detail.jsx';
import TambahBerita from './admin/page/Berita/Tambah.jsx';
import User from './admin/page/User.jsx';
import Setting from './admin/component/Setting.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />,
  },
  {
    path: "/kegiatan",
    element: <Kegiatan />,
  },
  {
    path: "/layanan",
    element: <Layanan />,
  },
  {
    path: "/kontak",
    element: <Kontak />,
  },
  {
    path: "/sejarah-singkat",
    element: <SejarahSingkat />,
  },
  {
    path: "/struktur-organisasi",
    element: <StrukturOrganisasi />,
  },
  {
    path: "/tujuan",
    element: <Tujuan />,
  },
  {
    path: "/filosofi",
    element: <Filosofi />,
  },
  {
    path: "/falsafah",
    element: <Falsafah />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/siswa",
    element: <Siswa />,
  },
  {
    path: "/warga",
    element: <Warga />,
  },
  {
    path: "/rayon",
    element: <Rayon />,
  },
  {
    path: "/subrayon",
    element: <SubRayon />,
  },
  {
    path: "/pusdiklat",
    element: <Pusdiklat />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/tambah-siswa",
    element: <TambahSiswa />,
  },
  {
    path: "/detail-siswa",
    element: <DetailSiswa />,
  },
  {
    path: "/tambah-warga",
    element: <TambahWarga />,
  },
  {
    path: "/detail-warga",
    element: <DetailWarga />,
  },
  {
    path: "/detail-subrayon",
    element: <DetailSubRayon />,
  },
  {
    path: "/tambah-subrayon",
    element: <TambahSubRayon />,
  },
  {
    path: "/layanan-admin",
    element: <LayananAdmin />,
  },
  {
    path: "/detail-pusdiklat",
    element: <DetailPusdiklat />,
  },
  {
    path: "/tambah-pusdiklat",
    element: <TambahPusdiklat />,
  },
  {
    path: "/detail-rayon",
    element: <DetailRayon />,
  },
  {
    path: "/tambah-rayon",
    element: <TambahRayon />,
  },
  {
    path: "/detail-struktur-organisasi",
    element: <DetailStrukturOrganisasi />,
  },
  {
    path: "/tambah-struktur-organisasi",
    element: <TambahStrukturOrganisasi />,
  },
  {
    path: "/detail-sejarah-singkat",
    element: <DetailSejarahSingkat />,
  },
  {
    path: "/tambah-ketua-ranting",
    element: <TambahKetuaRanting />,
  },
  {
    path: "/tambah-galeri",
    element: <TambahGaleri />,
  },
  {
    path: "/detail-galeri",
    element: <DetailGaleri />,
  },
  {
    path: "/tambah-kegiatan",
    element: <TambahKegiatan />,
  },
  {
    path: "/detail-kegiatan",
    element: <DetailKegiatan />,
  },
  {
    path: "/tambah-berita",
    element: <TambahBerita />,
  },
  {
    path: "/detail-berita",
    element: <DetailBerita />,
  },
  {
    path: "/upload-data",
    element: <UploadData />,
  },
  {
    path: "/ketua-ranting",
    element: <KetuaRanting />,
  },
  {
    path: "/berita",
    element: <Berita />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
  // {
  //   path: "/uploadexcel",
  //   element: <UploadExcel />,
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
