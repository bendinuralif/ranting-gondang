import Layout from "./Layout";
import CustomCarousel from "../components/Carousel";
import kegiatan1 from "../assets/img/kegiatan-1.jpg";
import kegiatan2 from "../assets/img/kegiatan-2.jpg";
import kegiatan3 from "../assets/img/kegiatan-3.jpg";
import CardKegiatan1 from "../components/CardKegiatan1"


function Kegiatan() {
  return (
    <div>
      <Layout>
      <div class="block mx-auto max-w-7xl mt-40 mb-10 sm:px-10">
          <div class="">
            <a href="#">
              <h5 class="mb-3 md:mb-5 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center md:text-3xl">
                KEGIATAN TERBARU
              </h5>
            </a>
            <CardKegiatan1 />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Kegiatan;
