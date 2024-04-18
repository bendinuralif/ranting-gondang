import Layout from './Layout';
import galeri1 from '../assets/img/galeri-1.jpg';
import galeri2 from '../assets/img/galeri-2.jpg';

function SejarahSingkat() {
    return (
        <div>
            <Layout>
                <div className="pt-20 text-center">
                    <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-">
                        SEJARAH SINGKAT
                    </div>
                </div>

                {/* Bagian pertama */}
                <div className="font-inter text-[1.2rem] md:text-4xl font-bold pt-10 md:pt-20 pl-4 text-center">
                        PERSAUDARAAN SETIA HATI TERATE 
                        </div>
                <div className="flex flex-col md:flex-row justify-between items-center m-5 ">
                <div className="md:w-1/2 flex justify-center md:items-start">
                        <div className="rounded-lg bg-white px-4 shadow-md">
                            <img src={galeri1} alt="" />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        
                        <p className="text-sm mb-3 p-5 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
                        Didirikan di Madiun pada tahun 1922 oleh Ki Hajar Hardjo Oetomo
              (1888 – 1952), seorang pahlawan Perintis Kemerdekaan RI, PSHT
              semula bernama Setia Hati Pemuda Sport Club (SH PSC) yang
              berbentuk organisasi. Nama ini kemudian menjadi Persaudaraan Setia
              Hati “Pemuda Sport Club” dan akhirnya diubah menjadi “Persaudaraan
              Setia Hati Terate” dalam kongres pertama di Madiun, 25 Maret 1951.
              <br />
              <br />
              Perkembangan PSHT tidak terlepas dari jasa beberapa tokoh yang
              turut membesarkan PSHT, diantaranya Bpk. RM Soetomo Mangkudjojo;
              Bpk. Santoso Kartoatmodjo; Bpk. Irsyad; Mas RM. Imam Koesoepangat
              dan Mas KRT Tarmadji Budi Harsono, SE. Beliau-beliaulah yang
              meletakkan berbagai dasar dan memperintis pengembangan PSHT yang
              masih digunakan dan berlaku hingga saat ini. Berkat jasa mereka
              semua, PSHT sejak lama sudah memiliki AD-ART, mendirikan sebuah
              yayasan, mengembangkan PSHT dengan membentuk banyak cabang,
              membangun padepokan sebagai pusat kegiatan PSHT, mendirikan
              koperasi yang kini akan diperluas dengan melibatkan semua anggota
              di seluruh cabang, dan makin dikenalnya PSHT melalui berbagai
              kejuaraan.
              <br />
              <br />
              Kepengurusan yang baru di bawah pimpinan DR. Ir. M. Taufiq SH.,
              MSc. selaku Ketua Umum untuk periode 2021 – 2026, telah menetapkan
              rencana strategis yang digunakan sebagai pedoman bagi seluruh
              pengurus di semua tingkatan. Dibandingkan dengan kepengurusan
              sebelumnya, pada periode ini organisasi PSHT mengalami perubahan
              struktur dan diperluas dengan menambah bidang Pengabdian
              Masyarakat untuk lebih mengorganisir kegiatan-kegiatan PSHT yang
              memberi dampak langsung dan positif terhadap masyarakat.
                        </p>
                    </div>
                    
                </div>

                {/* Bagian kedua */}
                <div className="flex flex-col md:flex-row justify-between items-center m-5 md:m-5 mt-10">
                
                    <div className="md:w-1/2">
                        <div className="font-inter text-[1.2rem] md:text-4xl font-bold pt-10 md:pt-20 pl-4 text-center md:text-justify">
                            RANTING GONDANG
                        </div>
                        <p className="text-sm mb-3 p-5 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
                        Didirikan di Madiun pada tahun 1922 oleh Ki Hajar Hardjo Oetomo
              (1888 – 1952), seorang pahlawan Perintis Kemerdekaan RI, PSHT
              semula bernama Setia Hati Pemuda Sport Club (SH PSC) yang
              berbentuk organisasi. Nama ini kemudian menjadi Persaudaraan Setia
              Hati “Pemuda Sport Club” dan akhirnya diubah menjadi “Persaudaraan
              Setia Hati Terate” dalam kongres pertama di Madiun, 25 Maret 1951.
              <br />
              <br />
              Perkembangan PSHT tidak terlepas dari jasa beberapa tokoh yang
              turut membesarkan PSHT, diantaranya Bpk. RM Soetomo Mangkudjojo;
              Bpk. Santoso Kartoatmodjo; Bpk. Irsyad; Mas RM. Imam Koesoepangat
              dan Mas KRT Tarmadji Budi Harsono, SE. Beliau-beliaulah yang
              meletakkan berbagai dasar dan memperintis pengembangan PSHT yang
              masih digunakan dan berlaku hingga saat ini. Berkat jasa mereka
              semua, PSHT sejak lama sudah memiliki AD-ART, mendirikan sebuah
              yayasan, mengembangkan PSHT dengan membentuk banyak cabang,
              membangun padepokan sebagai pusat kegiatan PSHT, mendirikan
              koperasi yang kini akan diperluas dengan melibatkan semua anggota
              di seluruh cabang, dan makin dikenalnya PSHT melalui berbagai
              kejuaraan.
              <br />
              <br />
              Kepengurusan yang baru di bawah pimpinan DR. Ir. M. Taufiq SH.,
              MSc. selaku Ketua Umum untuk periode 2021 – 2026, telah menetapkan
              rencana strategis yang digunakan sebagai pedoman bagi seluruh
              pengurus di semua tingkatan. Dibandingkan dengan kepengurusan
              sebelumnya, pada periode ini organisasi PSHT mengalami perubahan
              struktur dan diperluas dengan menambah bidang Pengabdian
              Masyarakat untuk lebih mengorganisir kegiatan-kegiatan PSHT yang
              memberi dampak langsung dan positif terhadap masyarakat.
                        </p>
                    </div>
                    <div className="md:w-1/2 flex justify-center items-center">
                        <div className="rounded-lg bg-white p-4 shadow-md">
                            <img src={galeri2} alt="" />
                        </div>
                    </div>
                </div>

                {/* Bagian ketiga */}
                <div className="flex flex-col md:flex-row justify-between items-center m-5 md:m-[150px] mt-10">
                    <div className="md:w-1/2 flex justify-center items-center">
                        <div className="rounded-lg bg-white p-4 shadow-md">
                            <img src={galeri1} alt="" />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="font-inter text-4xl font-bold pt-10 pl-4">
                            MENGAPA HARUS
                        </div>
                        <div className="font-inter text-4xl font-bold pl-4 text-[#EC0000]">
                            LENSA KARYA ?
                        </div>
                        <p className="font-inter text-xl font-normal p-4">
                            Lensa Karya, ahli cerita visual, menangkap ratusan momen istimewa dengan kreativitas dan keahlian. Kami berbagi keindahan melalui gambar dan film unik Anda.
                        </p>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default SejarahSingkat;
