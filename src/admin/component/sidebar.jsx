import React, { useState } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiDocumentAdd, HiInformationCircle, HiViewGrid, HiTable, HiUser, HiLogout, HiExclamationCircle } from "react-icons/hi";
import app from "../../../src/lib/firebase/init";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "flowbite-react";

function CustomSidebar({ isOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/"); // Redirect to home page after logout
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <>
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
                href="/user"
                icon={HiUser}
                className="hover:bg-red-700 transition-colors duration-300"
              >
                User
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                href="/edit-user"
                icon={HiTable}
                className="hover:bg-red-700 transition-colors duration-300"
              >
                Edit User
              </FlowbiteSidebar.Item>
              <FlowbiteSidebar.Item
                as="button"
                onClick={() => setShowLogoutModal(true)}
                icon={HiLogout}
                className="hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
          </FlowbiteSidebar.Items>
        </FlowbiteSidebar>
      </div>

      <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <Modal.Header>
          <div className="flex items-center">
            <HiExclamationCircle className="text-red-600 text-xl mr-2" />
            <span>Konfirmasi Logout</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-gray-700">Apakah anda yakin untuk log out?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleLogout} className="hover:bg-red-600">
            Log Out
          </Button>
          <Button color="gray" onClick={() => setShowLogoutModal(false)} className="hover:bg-gray-500">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomSidebar;
