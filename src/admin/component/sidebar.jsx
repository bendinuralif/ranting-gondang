import React, { useState } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiDocumentAdd, HiInformationCircle, HiViewGrid, HiFilm } from "react-icons/hi";
import { IoMdGrid, } from "react-icons/io";
import { IoInformationCircleOutline,  } from "react-icons/io5";


function CustomSidebar({isOpen}) {
  
  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      {/* <div className="sidebar-toggler" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div> */}
      <FlowbiteSidebar aria-label="Sidebar with multi-level dropdown example" className={`bg-gray-800 text-white ${isOpen ? 'block' : 'hidden'} md:block absolute md:static transition-all duration-300 ease-in-out`}>
        <FlowbiteSidebar.Items>
          <FlowbiteSidebar.ItemGroup >
            <FlowbiteSidebar.Item href="/dashboard" icon={HiChartPie} className="hover:bg-red-700 transition-colors duration-300">
              Dashboard
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiInbox} className="hover:bg-red-700 transition-colors duration-300">
              Inbox
            </FlowbiteSidebar.Item>
            
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Siswa" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="/detailsiswa" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="/tambahsiswa" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Sub Rayon" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Pusdiklat" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Rayon" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Ketua Ranting" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Collapse icon={HiViewGrid} label="Struktur Organisasi" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" icon={HiInformationCircle} className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" icon={HiDocumentAdd} className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            
            <FlowbiteSidebar.Item href="#" icon={HiArrowSmRight} className="hover:bg-red-700 transition-colors duration-300">
              Sign In
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiTable} className="hover:bg-red-700 transition-colors duration-300">
              Sign Up
            </FlowbiteSidebar.Item>
          </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar.Items>
      </FlowbiteSidebar>
    </div>
  );
}

export default CustomSidebar;
