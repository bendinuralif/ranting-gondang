import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./../../lib/firebase/init";
import 'tailwindcss/tailwind.css';

// Konstanta untuk koleksi Firestore utama
const MAIN_COLLECTION = "__YOUR_FIRESTORE_ROOT_COLLECTION__";

function Dashboard() {
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore(app);
            try {
                const mainCollectionRef = collection(db, MAIN_COLLECTION);
                const snapshot = await getDocs(mainCollectionRef);
                
                const promises = snapshot.docs.map(async (doc) => {
                    const subCollectionRef = collection(db, doc.id);
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
                        <h3 className="text-lg font-semibold">Statistik Firestore</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {statistics.map((stat, index) => (
                            <div key={index} className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg">
                                <p className="text-xs font-semibold uppercase">Koleksi: {stat.collection}</p>
                                <p className="text-xl font-bold">{stat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}

export default Dashboard;
