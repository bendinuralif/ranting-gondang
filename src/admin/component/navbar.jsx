"use client";

import React from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from '../assets/img/Logo.png';

export function CustomNavbar({toggleSidebar}) {
  
  return (
    <Navbar fluid rounded>
      <Navbar.Toggle onClick={toggleSidebar} />
      <Navbar.Brand href="/">
        <a className="flex items-center  md:pl-5" href="/">
          <img src={logo} alt="Logo" className="h-12" />
          <span className="self-center text-l md:text-xl font-semibold whitespace-nowrap text-black">RANTING GONDANG</span>
        </a>
      </Navbar.Brand>
      <div className="flex md:order-2 md:pr-10">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        
      </div>

    </Navbar>
  );
}

export default CustomNavbar;
