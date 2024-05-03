import Layout from "./Layout";
import img from "../assets/img/pengikatan.png";

function Filosofi() {
  return (
    <div>
      <Layout>
        <div className="md:px-20">
        <div className="pt-20 text-center">
          <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
            FILOSOFI
          </div>
        </div>
        <div className="flex justify-center items-center flex-col px-4 md:px-20">
        <img className="mt-5 px-5 md:px-20" src={img} alt="" width="1000" height="150" />

          <div className="text-[0.7rem] md:text-[1.1rem] text-center mt-1 px-7 italic">
            Pengikatan yang di gelar sebelum pengesahan warga baru
          </div>
          <div className="pt-10 md:px-20 mb-10">
          <div className="relative overflow-x-auto text-sm md:text-xl px-5 text-justify">
    <p>Persaudaraan Setia Hati Terate (PSHT) atau yang dikenal dengan SH Terate adalah suatu persaudaraan “perguruan” silat yang bertujuan mendidik dan membentuk manusia berbudi luhur, tahu benar dan salah, bertakwa kepada Tuhan Yang Maha Esa, mengajarkan kesetiaan pada hati sanubari sendiri serta mengutamakan persaudaraan antar warga (anggota) dan berbentuk suatu organisasi yang merupakan rumpun/aliran Persaudaraan Setia Hati (PSH). SH Terate termasuk salah satu 10 perguruan silat yang turut mendirikan Ikatatan Pencak Silat Indonesia (IPSI) pada kongres pencak silat tanggal 28 Mei 1948 di Surakarta.</p>
</div>

          </div>
        </div>
        </div>
      </Layout>
    </div>
  );
}

export default Filosofi;
