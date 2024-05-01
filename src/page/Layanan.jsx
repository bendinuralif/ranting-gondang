import React from 'react';
import { useForm } from 'react-hook-form';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import firebase from '../lib/firebase/init'; // Import Firebase

function Layanan () {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = async (data) => {
        try {
            // Simpan data ke Firebase
            await firebase.firestore().collection('layanan').add(data);
            alert('Data berhasil disimpan!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Terjadi kesalahan saat menyimpan data.');
        }
    };

    return(
        <Layout>
            <div className="pt-20 text-center">
                <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
                    LAYANAN
                </div>
            </div>

            <div className="mx-auto mb-10 px-6 md:px-10 rounded-lg md:max-w-7xl">
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
                    {/* Input Nama */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                            Nama
                        </label>
                        <input
                            {...register("nama", { required: true })}
                            id="nama"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Masukkan nama"
                        />
                        {errors.nama && <p className="text-red-500 text-xs mt-1">Nama harus diisi</p>}
                    </div>

                    {/* Input Alamat */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alamat">
                            Alamat
                        </label>
                        <input
                            {...register("alamat", { required: true })}
                            id="alamat"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Masukkan alamat"
                        />
                        {errors.alamat && <p className="text-red-500 text-xs mt-1">Alamat harus diisi</p>}
                    </div>

                    {/* Input Nomor Telepon */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telepon">
                            Nomor Telepon
                        </label>
                        <input
                            {...register("telepon", { required: true })}
                            id="telepon"
                            type="tel"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Masukkan nomor telepon"
                        />
                        {errors.telepon && <p className="text-red-500 text-xs mt-1">Nomor telepon harus diisi</p>}
                    </div>

                    {/* Input Deskripsi */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">
                            Deskripsi
                        </label>
                        <textarea
                            {...register("deskripsi", { required: true })}
                            id="deskripsi"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Masukkan deskripsi"
                        ></textarea>
                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">Deskripsi harus diisi</p>}
                    </div>

                    {/* Tombol Submit */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Layanan;
