import React, { useState } from "react";
import { Avatar, Dropdown, Navbar, Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import logo from '../assets/img/Logo.png';

export function CustomNavbar() {
  return (
    <Navbar fluid rounded className="bg-gray-200"> {/* Menambahkan kelas bg-gray-200 untuk latar belakang abu */}
      <Navbar.Brand href="/">
        <a className="flex items-center space-x-1" href="/">
          <img src={logo} alt="Logo" className="h-12" />
          <span className="self-center text-l md:text-xl font-semibold whitespace-nowrap text-black">RANTING GONDANG</span>
        </a>
      </Navbar.Brand>
    </Navbar>
  );
}

export function CustomSidebar() {
  const [isOpen, setIsOpen] = useState(true); // Mengatur isOpen menjadi true secara default

  // Fungsi untuk menampilkan atau menyembunyikan sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-toggler" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <FlowbiteSidebar aria-label="Sidebar with multi-level dropdown example" className="bg-gray-800 text-white">
        <FlowbiteSidebar.Items>
          <FlowbiteSidebar.ItemGroup>
            <FlowbiteSidebar.Item href="#" icon={HiChartPie} className="hover:bg-gray-700">
              Dashboard
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiInbox} className="hover:bg-gray-700">
              Inbox
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Collapse icon={HiShoppingBag} label="Siswa" className="hover:bg-gray-700">
              <FlowbiteSidebar.Item href="#" className="hover:bg-gray-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" className="hover:bg-gray-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Item href="#" icon={HiUser} className="hover:bg-gray-700">
              Users
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiShoppingBag} className="hover:bg-gray-700">
              Products
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiArrowSmRight} className="hover:bg-gray-700">
              Sign In
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiTable} className="hover:bg-gray-700">
              Sign Up
            </FlowbiteSidebar.Item>
          </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar.Items>
      </FlowbiteSidebar>
    </div>
  );
}

export default { CustomNavbar, CustomSidebar };
