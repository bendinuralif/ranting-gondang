import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from '../src/page/Home.jsx'
import GalleryPage from './page/Gallery';
import Kegiatan from './page/Kegiatan.jsx';
import Layanan from './page/Layanan.jsx';
import Kontak from './page/Kontak.jsx';
import SejarahSingkat from './page/SejarahSingkat.jsx';
import StrukturOrganisasi from './page/StrukturOrganisasi.jsx';
import Tujuan from './page/Tujuan.jsx';

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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
