import React from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Kontak() {
    return (
        <Layout>
            <div className="pt-20 text-center">
                <div className="text-2xl md:text-3xl font-semibold pt-10 pb-3 md:pb-10">
                    KONTAK
                </div>
            </div>

            <div className="mx-auto mb-10 px-6 md:px-10 rounded-lg md:max-w-7xl">
                <div className="flex flex-col md:flex-row md:justify-between md:space-x-10">
                    {/* Contact Information */}
                    <div className="flex-1 p-4 leading-normal">
                        <h2 className="font-semibold text-xl md:text-2xl pb-3 text-left">PSHT Ranting Gondang Cabang Sragen</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg text-gray-600 mt-1" />
                                <div className="ml-4 text-left text-gray-700">
                                    Glonggong RT.19 RW. 04, Glonggong, Kec. Gondang, Kab. Sragen 57254
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faPhone} className="text-lg text-gray-600 mt-1" />
                                <div className="ml-4 text-left text-gray-700">
                                    +62 852-9286-0995
                                </div>
                            </div>
                            <div className="flex items-start">
                                <FontAwesomeIcon icon={faEnvelope} className="text-lg text-gray-600 mt-1" />
                                <div className="ml-4 text-left text-gray-700">
                                    rantinggondang@gmail.com
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 mt-8 md:mt-0">
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6653.828331135423!2d111.10769947711583!3d-7.422018983293427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79f96aff8e9c15%3A0x89c7572f644c8d64!2sPadepokan%20PSHT%20Ranting%20Gondang%20Cab.Sragen!5e0!3m2!1sid!2sid!4v1711235263831!5m2!1sid!2sid" 
                                width="100%" 
                                height="400" 
                                style={{ border: "0" }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Kontak;
