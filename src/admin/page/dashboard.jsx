import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import LayoutAdmin from "./LayoutAdmin";
import 'tailwindcss/tailwind.css';

const ItemCard = ({ title, count, youngestYear, oldestYear, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {youngestYear && oldestYear && (
            <p className="text-sm text-gray-500">
              {youngestYear} - {oldestYear}
            </p>
          )}
        </div>
        <p className="text-2xl font-bold text-red-600">{count}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [counts, setCounts] = useState({
    siswa: { count: 0, youngestYear: null, oldestYear: null },
    warga: { count: 0, youngestYear: null, oldestYear: null },
    subRayon: { count: 0 },
    rayon: { count: 0 },
    pusdiklat: { count: 0 },
    strukturOrganisasi: { count: 0 },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      try {
        const userSession = JSON.parse(sessionStorage.getItem("user"));
        if (userSession) {
          setSession(userSession);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to parse session storage", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const db = getFirestore();

        try {
          const collections = [
            { name: 'Siswa', key: 'siswa' },
            { name: 'Warga', key: 'warga' },
            { name: 'SubRayon', key: 'subRayon' },
            { name: 'Rayon', key: 'rayon' },
            { name: 'Pusdiklat', key: 'pusdiklat' },
            { name: 'StrukturOrganisasi', key: 'strukturOrganisasi' },
          ];

          const countsPromises = collections.map(async ({ name, key }) => {
            const snapshot = await getDocs(collection(db, name));
            let youngestYear = null;
            let oldestYear = null;

            if (key === 'siswa' || key === 'warga') {
              const youngestDoc = await getDocs(query(collection(db, name), orderBy('tahun', 'asc'), limit(1)));
              const oldestDoc = await getDocs(query(collection(db, name), orderBy('tahun', 'desc'), limit(1)));

              if (youngestDoc.docs.length > 0) {
                youngestYear = youngestDoc.docs[0].data().tahun;
              }
              if (oldestDoc.docs.length > 0) {
                oldestYear = oldestDoc.docs[0].data().tahun;
              }

              console.log(`Collection: ${name}, Youngest Year: ${youngestYear}, Oldest Year: ${oldestYear}`);
            }

            return { key, count: snapshot.size, youngestYear, oldestYear };
          });

          const countsResults = await Promise.all(countsPromises);
          const newCounts = countsResults.reduce((acc, { key, count, youngestYear, oldestYear }) => {
            acc[key] = { count, youngestYear, oldestYear };
            return acc;
          }, {});

          setCounts(newCounts);
        } catch (error) {
          console.error("Failed to fetch data from Firebase", error);
        }
      };

      fetchData();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-4xl font-extrabold mb-8">Dashboard</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Selamat Datang, {session.nama}!
            </h3>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Jumlah item:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ItemCard title="Siswa" count={counts.siswa.count} youngestYear={counts.siswa.youngestYear} oldestYear={counts.siswa.oldestYear} link="/siswa" />
            <ItemCard title="Warga" count={counts.warga.count} youngestYear={counts.warga.youngestYear} oldestYear={counts.warga.oldestYear} link="/warga" />
            <ItemCard title="SubRayon" count={counts.subRayon.count} link="/subrayon" />
            <ItemCard title="Rayon" count={counts.rayon.count} link="/rayon" />
            <ItemCard title="Pusdiklat" count={counts.pusdiklat.count} link="/pusdiklat" />
            <ItemCard title="Struktur Organisasi" count={counts.strukturOrganisasi.count} link="/strukturorganisasi" />
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default Dashboard;
