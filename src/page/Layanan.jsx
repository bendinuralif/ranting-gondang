import React from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Layanan () {
    return(
        <Layout>
        <div className="pt-20 text-center">
            <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
                LAYANAN
            </div>
        </div>

        <div className="mx-auto mb-10 px-6 md:px-10 rounded-lg md:max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-start md:space-x-10">
                {/* Contact Information */}
                <div className="flex-1 p-4 leading-normal">
                    <h2 className="font-semibold text-xl md:text-2xl pb-3 text-left">PSHT Ranting Gondang Cabang Sragen</h2>
                    <tbody>
                        <tr className="text-center">
                            <td className="px-2 py-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="pr-4 text-lg" /></td>
                            <td className="px-2 py-2"><div className=" text-left">Glonggong RT.19 RW. 04, Glonggong, Kec. Gondang, Kab. Sragen 57254</div></td>  
                        </tr>
                        <tr className="text-center">
                            <td className="px-2 py-2"><FontAwesomeIcon icon={faPhone} className="pr-4 text-lg" /></td>
                            <td className="px-2 py-2"> <div className=" text-left">+62 852-9286-0995</div></td>  
                        </tr>
                        <tr className="text-center">
                            <td className="px-2 py-2"><FontAwesomeIcon icon={faEnvelope} className="pr-4 text-lg" /></td>
                            <td className="px-2 py-2"><div className=" text-left">rantinggondang@gmail.com</div></td>  
                        </tr>
                    </tbody>
                </div>
                
                {/* Map */}
                <div className="flex-1 mt-8 md:mt-0 md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div style={{ maxWidth: '500px', margin: '0 auto', border: '2px solid #e5e7eb', borderRadius: '10px' }}>
                        
                    </div>
                </div>
            </div>
        </div>
    </Layout>
    )
}

export default Layanan