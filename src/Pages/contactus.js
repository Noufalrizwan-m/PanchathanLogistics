import React from 'react';
import PageHero from '../Components/pagehero';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="bg-gray-50">
            <PageHero
                title="Connect with Our Team"
                subtitle="Your next shipment begins with a conversation. We're here to assist you 24/7."
                breadcrumb="Home / Contact Us"
            />

            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8 p-8 bg-white rounded-xl shadow-xl border-t-4 border-[#175d29]">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Information</h2>

                        {/* Detail Block */}
                        {[
                            { icon: Phone, title: "24/7 Support", value: "+91 73394 33590 " },
                            { icon: Mail, title: "Email Inquiry", value: "info@panchathanlogistics.com" },
                            { icon: MapPin, title: "Corporate Address", value: "#1, Pallavan St, VOC Nagar, Pammal, Chennai, Tamil Nadu 600075" },
                                                        { icon: MapPin, title: "Warehouse Address", value: "#4, Lakshmi Nagar, Service Road, Anakaputhur, Chennai - 600 070." },
                            { icon: Clock, title: "Office Hours (IST)", value: "Mon - Sat: 10:00 AM - 7:30 PM" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex items-start space-x-4"
                            >
                                <item.icon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold uppercase text-[#175d29]">{item.title}</p>
                                    <p className="text-lg text-gray-800 font-medium">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:col-span-2 p-8 bg-white rounded-xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Your Personalized Quote</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" placeholder="Full Name" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#175d29]/50 transition duration-300" />
                                <input type="email" placeholder="Work Email" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#175d29]/50 transition duration-300" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="tel" placeholder="Phone Number (+91...)" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#175d29]/50 transition duration-300" />
                                <select required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#175d29]/50 transition duration-300 text-gray-600">
                                    <option value="" disabled selected>Service of Interest</option>
                                    <option>Air Freight</option>
                                    <option>Ocean Freight</option>
                                    <option>Domestic Surface</option>
                                    <option>Warehousing</option>
                                </select>
                            </div>
                            <textarea placeholder="Tell us about your shipment needs (cargo type, volume, origin/destination)" rows="5" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#175d29]/50 transition duration-300"></textarea>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:bg-amber-600 transition-colors duration-300"
                            >
                                Submit Request
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="h-[500px] w-full bg-gray-200 rounded-xl overflow-hidden shadow-2xl"
                >
                    {/* Placeholder for embedded map (e.g., Google Maps iframe) */}
                    <iframe
                        title="Panchathan Logistics Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.123456789!2d80.1389123!3d12.9767123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266abcdef1234%3A0x1234567890abcdef!2s1%20Pallavan%20St%2C%20VOC%20Nagar%2C%20Pammal%2C%20Chennai%2C%20Tamil%20Nadu%20600075!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </motion.div>
            </section>
        </div>
    );
};

export default Contact;