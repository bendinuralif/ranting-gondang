import React, { useState } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiDocumentAdd, HiInformationCircle, HiViewGrid, HiTable } from "react-icons/hi";

function CustomSidebar({ isOpen }) {
  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      <FlowbiteSidebar
        aria-label="Sidebar with multi-level dropdown example"
        className={`${isOpen ? 'block' : 'hidden'} bg-blue-800 text-white md:block absolute md:static transition-all duration-300 ease-in-out`}
      >
        <FlowbiteSidebar.Items>
          <FlowbiteSidebar.ItemGroup>
            <FlowbiteSidebar.Item
              href="/dashboard"
              icon={HiChartPie}
              className="hover:bg-red-700 transition-colors duration-300"
            >
              Dashboard
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item
              href="/layanan-admin"
              icon={HiInbox}
              className="hover:bg-red-700 transition-colors duration-300"
            >
              Layanan
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item
              href="/upload-data"
              icon={HiDocumentAdd}
              className="hover:bg-red-700 transition-colors duration-300"
            >
              Upload Data
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Collapse
              icon={HiViewGrid}
              label="Data"
              className="hover:bg-red-700 transition-colors duration-300"
            >
              <FlowbiteSidebar.Item
                href="/detail-siswa"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Siswa
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-warga"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Warga
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-subrayon"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Sub Rayon
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-rayon"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Rayon
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-pusdiklat"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Pusdiklat
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-struktur-organisasi"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Struktur Organiasi
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/detail-sejarah-singkat"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Ketua Ranting
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse
              icon={HiViewGrid}
              label="Galeri"
              className="hover:bg-red-700 transition-colors duration-300"
            >
              <FlowbiteSidebar.Item
                href="/detail-galeri"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Detail
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/tambah-galeri"
                icon={HiDocumentAdd}
                className="hover:bg-red-700"
              >
                Tambah
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse
              icon={HiViewGrid}
              label="Kegiatan"
              className="hover:bg-red-700 transition-colors duration-300"
            >
              <FlowbiteSidebar.Item
                href="/detail-kegiatan"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Detail
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/tambah-kegiatan"
                icon={HiDocumentAdd}
                className="hover:bg-red-700"
              >
                Tambah
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse
              icon={HiViewGrid}
              label="Berita"
              className="hover:bg-red-700 transition-colors duration-300"
            >
              <FlowbiteSidebar.Item
                href="/detail-berita"
                icon={HiInformationCircle}
                className="hover:bg-red-700"
              >
                Detail
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/tambah-berita"
                icon={HiDocumentAdd}
                className="hover:bg-red-700"
              >
                Tambah
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Item
              href="#"
              icon={HiArrowSmRight}
              className="hover:bg-red-700 transition-colors duration-300"
            >
              Sign In
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item
              href="#"
              icon={HiTable}
              className="hover:bg-red-700 transition-colors duration-300"
            >
              Sign Up
            </FlowbiteSidebar.Item>
          </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar.Items>
      </FlowbiteSidebar>
    </div>
  );
}

export default CustomSidebar;
