import CardBerita from "../components/CardBerita";
import Layout from "./Layout";



function Berita() {
  return (
    <div>
      <Layout>
      <div class="block mx-auto max-w-7xl mb-10 sm:px-10">
          <div class="">
          <div className="pt-20 text-center">
                <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
                    BERITA
                </div>
            </div>
          </div>
        </div>
        <CardBerita />
      </Layout>
    </div>
  );
}

export default Berita;
