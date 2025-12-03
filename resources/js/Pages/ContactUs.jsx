import { Head, useForm } from "@inertiajs/react";
import Layout from "./layout/Layout";
import call from "../img/call.png";
import map from "../img/map.png";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import TextAreaWithCount from "@/Components/TextAreaWithCount";
import PhoneInput from "@/Components/PhoneInput";

export default function ContactUs() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("submit.contactus"), {
            onSuccess: () => {
                reset();
            }
        });
    };
    return (
        <Layout>
            <Head title="Contact Us" />

            <div className="container mx-auto relative">
                {/* Background / grid block */}
                <div
                    className="flex items-center w-[90%] h-[600px] justify-center absolute -top-[70px] left-[5%] p-6 z-[-1]"
                >
                    <div className=" gridmap w-full h-full absolute top-0 left-0 z-[2]" />

                    <div
                        className="opacity-50 absolute w-full h-full rounded-2xl overflow-hidden z-[1]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, #686868 1px, transparent 1px), linear-gradient(to bottom, #686868 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex pt-[200px] relative z-[10]">
                    <div data-aos="fade-right" className="contacts w-full max-w-[50%] pe-[100px]">
                        <h2 className="text-white font-bold text-4xl mb-2">
                            Get in Touch With Us
                        </h2>
                        <p className="text-lg text-gray-200">
                            We're here to help with service queries, partnership requests, or support needs.
                        </p>

                        {/* Phone card */}
                        <div className="mt-[30px] relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800">
                            <div className="bg-black rounded-[19px] p-8  gap-6">
                                <img className="w-[70px] h-[70px]" src={call} alt="Call icon" />
                                <div>
                                    <a
                                        href="tel:+918747998747"
                                        className="text-white text-4xl mt-3 inline-block"
                                    >
                                        +91 8747 99 8747
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Address card */}
                        <div className="mt-[20px] relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800">
                            <div className="bg-black rounded-[19px] p-8   gap-6">
                                <img className="w-[70px] h-[70px]" src={map} alt="Map icon" />
                                <h2 className="text-white text-xl mt-3">
                                    #14 &amp; 1, Chowdeshwari Layout, Near ABS Bricks Factory,
                                    Honnenahalli, Yelahanka, B.B.M.P North, Karnataka — 560064
                                </h2>
                            </div>
                        </div>
                    </div>


                    <div data-aos="fade-left" className='w-full relative p-[1px] mb-4 rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800'>
                        <div className='w-full bg-black h-full rounded-[19px]'>
                            <div className="px-6 py-4 border-b border-gray-700 text-start">
                                <p className="text-white text-lg">Send Us a Message</p>
                            </div>

                            <form onSubmit={handleSubmit} method="post">
                                <div className="p-6">

                                    <div className="w-full">
                                        <InputLabel
                                            className="block text-gray-300 mb-2 uppercase"
                                            value="Name *"
                                        />
                                        <TextInput
                                            id="name"
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white focus:outline-none focus:border-main"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="w-full mt-3">
                                        <InputLabel
                                            className="block text-gray-300 mb-2 uppercase"
                                            value="Phone Number *"
                                        />
                                        <PhoneInput
                                            id="phone"
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white focus:outline-none focus:border-main"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="w-full mt-3">
                                        <InputLabel
                                            className="block text-gray-300 mb-2 uppercase"
                                            value="Email *"
                                        />
                                        <TextInput
                                            id="email"
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white focus:outline-none focus:border-main"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="w-full mt-3">
                                        <InputLabel
                                            className="block text-gray-300 mb-2 uppercase"
                                            value="Message *"
                                        />
                                        <TextAreaWithCount
                                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-600 text-white focus:outline-none focus:border-main"
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn bg-main text-white border-0 mt-4"
                                        disabled={processing}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>

                <div data-aos="fade-down" className="overflow-hidden">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7771.970076355303!2d77.58277789259292!3d13.100134298908538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1939fc6520d9%3A0xbb0d2f99ce89f084!2sBBMP%20office!5e0!3m2!1sen!2sin!4v1764666215569!5m2!1sen!2sin" width="600" height="350" className="border-0 w-full mt-8 rounded-[20px]" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </Layout>
    );
}
