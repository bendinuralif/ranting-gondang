import Layout from "./Layout";
import CustomCarousel from "../components/Carousel";
import Intro from "./../components/Intro";
import CardBerita from "../components/CardBerita";
import CardKegiatanHome from "../components/CardKegiatanHome";
import CardBeritaHome from "../components/CardBeritaHome";
import CardSejarah from "../components/CardSejarah";

function HomePage() {
  return (
    <div>
      <Layout>
        <CustomCarousel />
        <div class=" justify-center items-center">
          <div class="px-2 block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
            <div class="text-{1.2rem} font-bold    text-center mb-4 md:text-2xl">
              "Manusia dapat dihancurkan, manusia dapat dimatikan (dibunuh)
              tetapi manusia tidak dapat dikalahkan selama manusia itu setia
              pada hatinya sendiri atau ber-SH pada diri sendiri."
            </div>
          </div>
        </div>

        <Intro />

        <div class="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
          <div class="">
            <a href="#">
              <h5 class="mb-3 md:mb-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center md:text-3xl">
                PERSAUDARAAN SETIA HATI TERATE
              </h5>
            </a>
            <CardSejarah />
            <a
              href="/sejarah-singkat"
              class="inline-flex items-center px-3 py-2 text-xs  md:text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 mb-10"
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
          <a href="#">
              <h5 class="mb-3 md:mb-5 mt-5 md:mt-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center md:text-3xl">
                KEGIATAN TERBARU
              </h5>
            </a>
        <CardKegiatanHome />
        <a
              href="/kegiatan"
              class="inline-flex items-center px-3 py-2 text-xs  md:text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 md:ml-10"
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
            <a href="#">
              <h5 class="mb-3 md:mb-5 mt-5 md:mt-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center md:text-3xl">
                BERITA TERBARU
              </h5>
            </a>
        <CardBeritaHome />
        <a
              href="/berita"
              class="inline-flex items-center px-3 py-2 text-xs  md:text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5 md:ml-"
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
        
      </Layout>
    </div>
  );
}

export default HomePage;
