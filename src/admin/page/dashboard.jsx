import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line as LineChart } from 'react-chartjs-2';
import LayoutAdmin from "./LayoutAdmin";
import { collection, getFirestore, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { openDB } from 'idb';
import app from "./../../lib/firebase/init";
import 'tailwindcss/tailwind.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Konstanta untuk koleksi Firestore utama
const MAIN_COLLECTIONS = [
  { name: "Warga", displayName: "Warga", icon: "UserGroupIcon", link: "/detail-warga" },
  { name: "Siswa", displayName: "Siswa", icon: "AcademicCapIcon", link: "/detail-siswa" },
  { name: "StrukturOrganisasi", displayName: "Struktur Organisasi", icon: "OfficeBuildingIcon", link: "/detail-struktur-organisasi" },
  { name: "SubRayon", displayName: "Sub Rayon", icon: "MapIcon", link: "/detail-subrayon" },
  { name: "Rayon", displayName: "Rayon", icon: "LocationMarkerIcon", link: "/detail-rayon" },
  { name: "Pusdiklat", displayName: "Pusdiklat", icon: "LibraryIcon", link: "/detail-pusdiklat" }
];

// Membuka database IndexedDB
const dbPromise = openDB('app-db', 1, {
  upgrade(db) {
    db.createObjectStore('firestore-cache');
  }
});

// Menyimpan data ke IndexedDB
const saveToCache = async (key, data) => {
  const db = await dbPromise;
  await db.put('firestore-cache', data, key);
};

// Mengambil data dari IndexedDB
const getFromCache = async (key) => {
  const db = await dbPromise;
  return await db.get('firestore-cache', key);
};

function Dashboard() {
  const [statistics, setStatistics] = useState([]);
  const [session, setSession] = useState(null); // Menyimpan informasi sesi
  const [chartData, setChartData] = useState(null); // Data untuk grafik

  useEffect(() => {
    // Logika untuk memeriksa sesi pengguna
    const checkSession = () => {
      const userSession = JSON.parse(sessionStorage.getItem("user")); // Misalnya, Anda menyimpan sesi pengguna dalam sessionStorage
      if (userSession) {
        setSession(userSession); // Set sesi jika ada
      } else {
        // Redirect ke halaman login jika tidak ada sesi
        window.location.href = "/login"; // Ubah "/login" sesuai dengan rute login Anda
      }
    };

    checkSession(); // Panggil fungsi untuk memeriksa sesi saat komponen dimuat

    const fetchData = async () => {
      const db = getFirestore(app);
      const pageSize = 10; // Sesuaikan dengan kebutuhan
      const cacheKey = 'main-collections-data';
      
      try {
        // Cek data dari cache terlebih dahulu
        const cachedData = await getFromCache(cacheKey);
        if (cachedData) {
          setStatistics(cachedData.statistics);
          setChartData(cachedData.chartData);
          return;
        }

        const fetchCollectionData = async (collectionItem) => {
          let lastVisible = null;
          const collectionKey = `${collectionItem.name}-data`;
          const cachedCollectionData = await getFromCache(collectionKey);

          if (cachedCollectionData) {
            return cachedCollectionData;
          }

          let allDocs = [];
          let hasMore = true;

          while (hasMore) {
            let q = query(collection(db, collectionItem.name), limit(pageSize));
            if (lastVisible) {
              q = query(collection(db, collectionItem.name), startAfter(lastVisible), limit(pageSize));
            }

            const snapshot = await getDocs(q);
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            allDocs = allDocs.concat(snapshot.docs);

            if (snapshot.size < pageSize) {
              hasMore = false;
            }
          }

          const data = {
            name: collectionItem.displayName,
            count: allDocs.length,
            icon: collectionItem.icon,
            link: collectionItem.link,
            years: allDocs.map(doc => doc.data().tahun).filter(year => year).sort((a, b) => a - b)
          };

          await saveToCache(collectionKey, data);
          return data;
        };

        const promises = MAIN_COLLECTIONS.map(fetchCollectionData);
        const stats = await Promise.all(promises);
        console.log("Statistics:", stats);
        setStatistics(stats);

        // Proses data untuk grafik
        const wargaData = stats.find(stat => stat.name === "Warga");
        const siswaData = stats.find(stat => stat.name === "Siswa");

        if (wargaData && siswaData) {
          const years = [...new Set([...wargaData.years, ...siswaData.years])].sort((a, b) => a - b);

          const wargaCounts = years.map(year => wargaData.years.filter(y => y === year).length);
          const siswaCounts = years.map(year => siswaData.years.filter(y => y === year).length);

          const chartData = {
            labels: years,
            datasets: [
              {
                label: 'Warga',
                data: wargaCounts,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
              },
              {
                label: 'Siswa',
                data: siswaCounts,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
              }
            ]
          };
          setChartData(chartData);

          // Simpan data ke cache
          await saveToCache(cacheKey, { statistics: stats, chartData });
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  const icons = {
    UserGroupIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8zM22 11a4 4 0 11-8 0 4 4 0 018 0zM2 11a4 4 0 108 0 4 4 0 00-8 0z" />
      </svg>
    ),
    AcademicCapIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m-4 4H8a4 4 0 014-4 4 4 0 014 4h-1a4 4 0 01-8 0z" />
      </svg>
    ),
    OfficeBuildingIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-6 5h6m-6 0V4m0 13V4m0 0H5m2 0h3m3 0H9m3 0h3m3 0H7m3 0H7m0 0V4" />
      </svg>
    ),
    MapIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21l4-5 4 5m-4-5V2" />
      </svg>
    ),
    LocationMarkerIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.05 4.05a7 7 0 019.9 0 7 7 0 010 9.9l-5 5-5-5a7 7 0 010-9.9z" />
      </svg>
    ),
    LibraryIcon: (
      <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h8M8 15h8m-8-4h8m-8-4h8m-2 10v5h2a1 1 0 001-1v-4m-4 0H8a1 1 0 00-1 1v4m2-5V9a2 2 0 00-2-2H5a2 2 0 00-2 2v5m2 0v5a1 1 0 001 1h2v-5" />
      </svg>
    )
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Selamat Datang, {session ? session.nama : "User"}!
            </h3>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Jumlah Item</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics.map((stat, index) => (
              <Link to={stat.link} key={index} className="block">
                <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {icons[stat.icon]}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800">{stat.name}</h4>
                      <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                      {stat.years && stat.years.length > 0 && (
                        <p className="text-sm text-gray-600">Tahun: {stat.years[0]} - {stat.years[stat.years.length - 1]}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Grafik Warga dan Siswa dari Tahun ke Tahun
            </h3>
          </div>
          {chartData ? (
            <LineChart data={chartData} />
          ) : (
            <p className="text-gray-600">Loading data...</p>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default Dashboard;
