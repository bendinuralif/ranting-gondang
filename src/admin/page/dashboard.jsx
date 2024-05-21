import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./../../lib/firebase/init";
import 'tailwindcss/tailwind.css';

// Konstanta untuk koleksi Firestore utama
const MAIN_COLLECTION = "__YOUR_FIRESTORE_ROOT_COLLECTION__";

function Dashboard() {
    const [statistics, setStatistics] = useState([]);
    const [session, setSession] = useState(null); // Menyimpan informasi sesi

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
            try {
                const mainCollectionRef = collection(db, MAIN_COLLECTION);
                const snapshot = await getDocs(mainCollectionRef);
                
                const promises = snapshot.docs.map(async (doc) => {
                    const subCollectionRef = collection(db, MAIN_COLLECTION, doc.id, "subcollection"); // Adjust this to match your subcollection path
                    const subSnapshot = await getDocs(subCollectionRef);
                    return { collection: doc.id, count: subSnapshot.size };
                });

                const stats = await Promise.all(promises);
                setStatistics(stats);
            } catch (error) {
                console.error("Error fetching Firestore data:", error);
                // Handle error here
            }
        };

        fetchData();
    }, []);

    return (
        <LayoutAdmin>
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            Selamat Datang, {session ? session.nama : "User"}  !
                        </h3>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 mt-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">jsahsa</h3>
                    </div>
                    
                </div>
            </div>
        </LayoutAdmin>
    );
}

export default Dashboard;
