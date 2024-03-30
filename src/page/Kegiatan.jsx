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
      <div class="block mx-auto max-w-7xl mb-10 sm:px-10">
          <div class="">
          <div className="pt-20 text-center">
                <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
                    KEGIATAN
                </div>
            </div>
            <CardKegiatan1 />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Kegiatan;
