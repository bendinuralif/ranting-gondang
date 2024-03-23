import Layout from "./Layout";
import CustomCarousel from "../components/Carousel";

function HomePage() {
  return (
    <div>
      <Layout>
        <CustomCarousel />
        <div class=" justify-center items-center">
          <a href="#" class="px-2 block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
            <div class="text-sm font-bold text-center mb-4 md:text-xl">
              "Manusia dapat dihancurkan, manusia dapat dimatikan (dibunuh)
              tetapi manusia tidak dapat dikalahkan selama manusia itu setia
              pada hatinya sendiri atau ber-SH pada diri sendiri."
            </div>
          </a>
        </div>

        <div class="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
          <a href="#">
            <img
              class="rounded-t-lg"
              src="/docs/images/blog/image-1.jpg"
              alt=""
            />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center md:text-3xl">
                PERSAUDARAAN SETIA HATI TERATE
              </h5>
            </a>
            <p class="text-xs mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg">
            Didirikan di Madiun pada tahun 1922 oleh Ki Hajar Hardjo Oetomo (1888 – 1952), seorang pahlawan Perintis Kemerdekaan RI, PSHT semula bernama Setia Hati Pemuda Sport Club (SH PSC) yang berbentuk organisasi. Nama ini kemudian menjadi Persaudaraan Setia Hati “Pemuda Sport Club” dan akhirnya diubah menjadi “Persaudaraan Setia Hati Terate” dalam kongres pertama di Madiun, 25 Maret 1951.
        <br /><br />
        Perkembangan PSHT tidak terlepas dari jasa beberapa tokoh yang turut membesarkan PSHT, diantaranya Bpk. RM Soetomo Mangkudjojo; Bpk. Santoso Kartoatmodjo; Bpk. Irsyad; Mas RM. Imam Koesoepangat dan Mas KRT Tarmadji Budi Harsono, SE. Beliau-beliaulah yang meletakkan berbagai dasar dan memperintis pengembangan PSHT yang masih digunakan dan berlaku hingga saat ini. Berkat jasa mereka semua, PSHT sejak lama sudah memiliki AD-ART, mendirikan sebuah yayasan, mengembangkan PSHT dengan membentuk banyak cabang, membangun padepokan sebagai pusat kegiatan PSHT, mendirikan koperasi yang kini akan diperluas dengan melibatkan semua anggota di seluruh cabang, dan makin dikenalnya PSHT melalui berbagai kejuaraan.
        <br /><br />
        Kepengurusan yang baru di bawah pimpinan DR. Ir. M. Taufiq SH., MSc. selaku Ketua Umum untuk periode 2021 – 2026, telah menetapkan rencana strategis yang digunakan sebagai pedoman bagi seluruh pengurus di semua tingkatan. Dibandingkan dengan kepengurusan sebelumnya, pada periode ini organisasi PSHT mengalami perubahan struktur dan diperluas dengan menambah bidang Pengabdian Masyarakat untuk lebih mengorganisir kegiatan-kegiatan PSHT yang memberi dampak langsung dan positif terhadap masyarakat.
            </p>
            <a
              href="/sejarah-singkat"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
            >
              Selengkapnya
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default HomePage;
