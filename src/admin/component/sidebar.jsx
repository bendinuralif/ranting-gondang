import React, { useState } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { IoMdGrid } from "react-icons/io";


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
            <FlowbiteSidebar.Item href="#" icon={HiChartPie} className="hover:bg-red-700 transition-colors duration-300">
              Dashboard
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiInbox} className="hover:bg-red-700 transition-colors duration-300">
              Inbox
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Collapse icon={IoMdGrid} label="Siswa" className="hover:bg-red-700 transition-colors duration-300">
              <FlowbiteSidebar.Item href="#" className="hover:bg-red-700">Detail</FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item href="#" className="hover:bg-red-700">Tambah</FlowbiteSidebar.Item>
            </FlowbiteSidebar.Collapse>
            <FlowbiteSidebar.Item href="#" icon={HiUser} className="hover:bg-red-700 transition-colors duration-300">
              Users
            </FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="#" icon={HiShoppingBag} className="hover:bg-red-700 transition-colors duration-300">
              Products
            </FlowbiteSidebar.Item>
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
