import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome() {
    const launchDate = new Date("2025-12-31T00:00:00").getTime();

    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance <= 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
                hours: String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
                minutes: String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0"),
                seconds: String(Math.floor((distance / 1000) % 60)).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Coming Soon - KSwift" />

            {/* 🌈 Gradient Background */}
            <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-[#1a1a1a] relative overflow-hidden">

                {/* Animated glow orbs */}
                <div className="absolute top-10 left-10 w-52 h-52 bg-[#ff2d20]/30 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute bottom-16 right-16 w-72 h-72 bg-purple-500/20 blur-[100px] rounded-full animate-pulse"></div>

                {/* ⭐ Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-2xl text-center">

                    {/* Logo */}
                    <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow mb-3">
                        🚀 KSwift
                    </h1>

                    <p className="text-gray-300 text-lg mb-8">
                        Something amazing is launching soon...
                    </p>

                    {/* 🔥 FLIP ANIMATED GLOW TIMER */}
                    <div className="flex justify-center items-center gap-6 mb-10">
                        <FlipUnit value={timeLeft.days} label="Days" />
                        <FlipUnit value={timeLeft.hours} label="Hours" />
                        <FlipUnit value={timeLeft.minutes} label="Minutes" />
                        <FlipUnit value={timeLeft.seconds} label="Seconds" />
                    </div>

                    <p className="text-gray-400 text-sm mt-8">
                        © {new Date().getFullYear()} KSwift Services. All rights reserved.
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                .flip-box {
                    perspective: 1000px;
                    display: inline-block;
                }

                .flip {
                    position: relative;
                    width: 90px;
                    height: 110px;
                    font-size: 55px;
                    font-weight: bold;
                    color: white;
                    background: linear-gradient(145deg, #ff2d20, #c91c12);
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(255, 45, 32, 0.6);
                }

                .flip:before, .flip:after {
                    content: attr(data-value);
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backface-visibility: hidden;
                }

                .flip:before {
                    top: 0;
                    background: linear-gradient(145deg, #ff3b32, #cc2219);
                }

                .flip:after {
                    bottom: 0;
                    background: linear-gradient(145deg, #d11c14, #a91510);
                    transform: rotateX(180deg);
                }

                .flip.animate:before {
                    animation: flipTop .7s ease-in forwards;
                }

                .flip.animate:after {
                    animation: flipBottom .7s ease-out forwards;
                }

                @keyframes flipTop {
                    0% { transform: rotateX(0deg); }
                    100% { transform: rotateX(-180deg); }
                }

                @keyframes flipBottom {
                    0% { transform: rotateX(180deg); }
                    100% { transform: rotateX(0deg); }
                }
            `}</style>
        </>
    );
}

/* ⭐ Flip Component */
function FlipUnit({ value, label }) {
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        setFlip(true);
        const timer = setTimeout(() => setFlip(false), 700);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="text-center">
            <div className="flip-box">
                <div className={`flip ${flip ? "animate" : ""}`} data-value={value}></div>
            </div>
            <p className="mt-3 text-gray-300 text-sm tracking-wide">{label}</p>
        </div>
    );
}
