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
import Login from './page/login.jsx';
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
    path: "/siswa",
    element: <Siswa />,
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
    path: "/tambahsiswa",
    element: <TambahSiswa />,
  },
  {
    path: "/detailsiswa",
    element: <DetailSiswa />,
  },
  {
    path: "/detailsubrayon",
    element: <DetailSubRayon />,
  },
  {
    path: "/tambahsubrayon",
    element: <TambahSubRayon />,
  },
  {
    path: "/layananadmin",
    element: <LayananAdmin />,
  },
  {
    path: "/detailpusdiklat",
    element: <DetailPusdiklat />,
  },
  {
    path: "/tambahpusdiklat",
    element: <TambahPusdiklat />,
  },
  {
    path: "/detailrayon",
    element: <DetailRayon />,
  },
  {
    path: "/tambahrayon",
    element: <TambahRayon />,
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
