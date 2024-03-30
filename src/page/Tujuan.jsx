import Layout from "./Layout";
import img from "../assets/img/padepokan-pusat.jpg";

function Tujuan() {
  return (
    <div>
      <Layout>
        <div className="md:px-20">
        <div className="pt-20 text-center">
          <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
            MAKSUD DAN TUJUAN
          </div>
        </div>
        <div className="flex justify-center items-center flex-col px-4 md:px-20">
          <img className="mt-5 md:px-20" src={img} alt="" />
          <div className="text-xs md:text-[1rem] text-center mt-1 px-7 italic">
            Padepokan Agung Persaudaraan Setia Hati Terate, Jl.Merak 10 Madiun
          </div>
          <div className="pt-10 pr-5 md:px-20 mb-10">
          <div className="relative overflow-x-auto">
    <tr className="text-black text-sm md:text-xl py-8"> {/* Menambahkan kelas py-4 */}
        <th
            scope="row"
            className="font-medium text-black whitespace-nowrap"
            style={{ verticalAlign: "top", marginTop: "-0.75rem" }}
        >
            1.
        </th>
        <td className="text-justify">
            <span className="font-semibold">SH TERATE</span> bermaksud mendidikan manusia khususnya para anggota agar berbudi luhur tahu benar dan salah, beriman dan bertaqwa kepada Tuhan Yang Maha Esa;
        </td>
    </tr>
    <tr className="text-black text-sm md:text-xl">
        <th
            scope="row"
            className="px-6  font-medium text-black whitespace-nowrap"
            style={{ verticalAlign: "top", marginTop: "-0.75rem" }}
        >
            2. 
        </th>
        <td className=" text-justify">
            <span className="font-semibold">SH TERATE</span> bertujuan ikut mamayu hayuning bawana.
        </td>
    </tr>
</div>

          </div>
        </div>
        </div>
      </Layout>
    </div>
  );
}

export default Tujuan;
