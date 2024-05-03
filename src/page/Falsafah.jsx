import Layout from "./Layout";
import img from "../assets/img/pengikatan.png";

function Falsafah() {
  return (
    <div>
      <Layout>
        <div className="md:px-20">
          <div className="pt-20 text-center">
            <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
              FALSAFAH
            </div>
          </div>
          <div className="flex justify-center items-center flex-col px-4 md:px-20">
            <img className="mt-5 md:px-20" src={img} alt="" />
            <div className="text-[0.7rem] md:text-[1.2rem] text-center mt-1 px-7 italic">
              Pengikatan yang di gelar sebelum pengesahan warga baru
            </div>
            <div className="pt-10 pr-5 md:px-20 mb-10">
              <div className="relative overflow-x-auto text-sm md:text-xl text-justify">
                <p>
                  Selain belajar pencak silat, warga atau anggota PSHT dibekali
                  dengan falsafah PSHT yang ditanamkan pada diri setiap
                  warganya. Falsafah dan ajaran yang utama dari PSHT adalah
                  manusia dapat dihancurkan, manusia dapat dimatikan (dibunuh)
                  tetapi manusia tidak dapat dikalahkan selama manusia itu setia
                  pada hatinya sendiri atau ber-SH pada diri sendiri. Tidak ada
                  kekuatan apapun di atas manusia yang bisa mengalahkan manusia
                  kecuali kecuali kekuatan Tuhan Yang Maha Esa.
                  <br />
                  <br />
                  Ajaran tersebut telah menjadi keyakinan kuat bagi semua warga
                  PSHT sehingga menjadi kekuatan tersendiri bagi anggota atau
                  warga secara pribadi maupun persaudaraan. Sebagai salah satu
                  seni bela diri yang berasal dari timur, PSHT bertujuan
                  membantu anggotanya untuk mengmbangkan karakter jujur, menjaga
                  keseimbangan fisik, mental/kecerdasan, emosi, sosial, dan
                  spiritual.
                  <br />
                  <br />
                  Di abad ke 21 ini, penanaman nilai-nilai luhur PSHT merupakan
                  tantangan tersendiri, utamanya bagi para pengurus karena
                  pengurus harus berhadapan dengan globalisasi dan kemajuan
                  teknologi yang tidak terbendung. Meski tidak ringan, pengurus
                  telah bertekad untuk tetap menjaga karakteristik PSHT tanpa
                  mengabaikan pengaruh kemajuan jaman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Falsafah;
