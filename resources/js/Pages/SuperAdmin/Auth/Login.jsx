import { Head, Link, useForm } from "@inertiajs/react";
import { useTheme } from "next-themes";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaSun, FaTable } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import GuestLayout from "../Layouts/GuestLayout";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useEffect, useRef, useState } from 'react';
import { IoMoon } from "react-icons/io5";
import NavLink from "@/Components/NavLink";
import Forgot from "./Forgot";
import ApplicationLogo from "@/Components/ApplicationLogo";
// import { Image } from "../../../../../public/images/common/Profilepic.jpg";
// import { useState } from "react";

export default function Login({ status }) {
    const { theme, setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.verify"), {
            onFinish: () => reset("password"),
        });
    };

    // for forgot password:
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const handleForgotSubmit = (email) => {
        // Add logic here to send reset email
    };

    // for dark and light mode:
    const [darkMode, setDarkMode] = useState(() =>
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <GuestLayout>
            <Head title="Login" />
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <div className="flex h-screen w-full fixed">
                {/* Left side - Banner */}
                <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden p-10">
                    <img
                        src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=1470&auto=format&fit=crop"
                        alt="Dashboard Analytics"
                        className="object-cover w-full h-[90vh] p-10"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-1">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-6">Welcome To Kswiftservices Admin Panel</h1>
                            <p className="text-lg opacity-90 mb-8">
                                Track your business performance with our powerful analytics tools and make data-driven decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-[45%] flex items-center p-5 justify-center dark:bg-[#0a0e25] bg-gray-100  transition-colors duration-300 sm:mr-[35px]">
                    <div className="w-full max-w-lg">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <div className='flex items-center gap-2'>
                                    <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto">
                                        <Link href={route('superadmin.dashboard')}>
                                            <ApplicationLogo className="block fill-current text-gray-800 dark:text-gray-200 h-10 w-32" />
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-sm mt-2 dark:text-gray-400 text-gray-600">Welcome back! Please enter your details.</p>
                            </div>

                            {/* Dark/Light Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className=" flex items-center gap-2 px-4 py-3 rounded-3xl text-sm hover:bg-gray-200 dark:hover:bg-blue-950 transition "
                            >
                                {darkMode ? (
                                    <FaSun size={20} className="text-gray-200" />
                                ) : (
                                    <IoMoon size={20} className="text-gray-800" />
                                )}
                                <span className="text-gray-800 dark:text-gray-100">
                                    {darkMode ? "Light" : "Dark"}
                                </span>
                            </button>

                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2 flex items-center gap-2">
                                    <MdEmail size={18} /> Email
                                </label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg dark:bg-[#131836] bg-white border dark:border-gray-700 border-gray-300 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    autoComplete="username"
                                    isFocused
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2 flex items-center gap-2">
                                    <RiLockPasswordFill size={18} /> Password
                                </label>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg dark:bg-[#131836] bg-white border dark:border-gray-700 border-gray-300 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Login Button */}
                            <div>
                                <PrimaryButton
                                    disabled={processing}
                                    width="w-full"
                                    padding="px-4 py-2"
                                    className="justify-center"
                                >
                                    Log in
                                </PrimaryButton>

                            </div>

                            {/* Or Divider */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t dark:border-gray-700 border-gray-300 w-full"></div>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <div>




                <Forgot
                    isOpen={isForgotOpen}
                    onClose={() => setIsForgotOpen(false)}
                    onSubmit={handleForgotSubmit}
                />
            </div>
        </GuestLayout>
    );
}
