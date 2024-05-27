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
  // Your collection definitions here
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
            <h3 className="text-xl font-semibold text-gray-700">
              Grafik Warga dan Siswa dari Tahun ke Tahun
            </h3>
          </div>
          {chartData && (
            <LineChart data={chartData} />
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default Dashboard;
