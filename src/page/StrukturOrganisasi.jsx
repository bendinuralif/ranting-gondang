import Layout from "./Layout";

function StrukturOrganisasi() {
  return (
    <Layout>
        <div className="pt-20">
          <div className="text-lg md:text-2xl font-semibold pt-10 text-center">
            STRUKTUR ORGANISASI RANTING GONDANG
          </div>
          <div className="text-lg md:text-2xl font-semibold  pb-5 text-center">
            CABANG SRAGEN
          </div>
        </div>
    <div className="justify-center items-center px-5">
      
        

        <a
          href="#"
          className=" px-2 block mx-auto max-w-7xl mt-10 mb-10  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <div className="relative overflow-x-auto mt-4">
            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-700 dark:text-gray-600">
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-red-00">
                <tr>
                  <th scope="col" className="px-2 py-2">
                    No
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Nama
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Jabatan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">1</td>
                  <td className="px-2 py-2">Ir. Eddy Asmanto</td>
                  <td className="px-2 py-2">Ketua Majelis Luhur</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">2</td>
                  <td className="px-2 py-2">Ir. R.B Wijono</td>
                  <td className="px-2 py-2">Ketua Majelis Ajar</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">3</td>
                  <td className="px-2 py-2">DR.Ir.H.Muhammad Taufiq,SH.M.Sc.</td>
                  <td className="px-2 py-2">Ketua Umum</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">4</td>
                  <td className="px-2 py-2">Drs. Priyanto</td>
                  <td className="px-2 py-2">Ketua Dewan Cabang Sragen</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">5</td>
                  <td className="px-2 py-2">Suwanto, SE,MM</td>
                  <td className="px-2 py-2">Ketua Cabang Sragen</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-2 py-2">6</td>
                  <td className="px-2 py-2">Sumarno</td>
                  <td className="px-2 py-2">Ketua Ranting Gondang</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a>
      
    </div>
    </Layout>
  );
}

export default StrukturOrganisasi;
