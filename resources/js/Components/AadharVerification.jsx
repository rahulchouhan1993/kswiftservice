import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useAlerts } from "./Alerts";

export default function AadharVerification({
    value = "",
    onChange,
    onVerified,
    disabled = false,
    initiallyVerified = false,
    isRequired = false,
    setAadharVerified = false,
}) {
    const [otpSent, setOtpSent] = useState(false);
    const [otpInputs, setOtpInputs] = useState(Array(6).fill(""));
    const [countdown, setCountdown] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [otpProcessing, setOtpProcessing] = useState(false);
    const [otpDetails, setOtpDetails] = useState(null);
    const [isVerified, setIsVerified] = useState(initiallyVerified);
    const [refId, setRefId] = useState(null);
    const [token, setToken] = useState(null);
    const otpRefs = useRef([]);
    const { successAlert, errorAlert, errorsHandling } = useAlerts();


    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleOtpChange = (e, index) => {
        const val = e.target.value;
        if (!/^\d?$/.test(val)) return;

        const updatedInputs = [...otpInputs];
        updatedInputs[index] = val;
        setOtpInputs(updatedInputs);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleSendOTP = async () => {
        if (countdown > 0 || !value) return;

        setProcessing(true);
        try {
            const response = await axios.post("/aadhar/send-otp", {
                aadhar_card_number: value,
            });

            if (response?.data?.status === true) {
                setOtpDetails(response.data);
                setOtpSent(true);
                successAlert(response.data.message);
                setRefId(response.data.ref_id);
                setToken(response.data.token);
                setCountdown(60);
            } else {
                errorAlert(response?.data?.message);
            }
        } catch (error) {
            errorAlert("Failed to send OTP.");
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otp = otpInputs.join("");
        if (otp.length !== 6) return errorAlert("Please enter a valid 6-digit OTP.");

        setOtpProcessing(true);
        try {
            const response = await axios.post("/aadhar/verify-otp", {
                aadhar_card_number: value,
                otp,
                ref_id: refId,
                token: token,
            });

            if (response?.data?.status === true) {
                successAlert("OTP verified successfully!");
                setOtpSent(false);
                setIsVerified(true);
                if (onVerified) onVerified(true, response.data);
            } else {
                errorAlert(response?.data?.message);
            }
        } catch (err) {
            console.log('err', err);
            errorAlert("Something went wrong");
        } finally {
            setOtpProcessing(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3">
                {/* Aadhar Input and Get OTP */}
                <div className="w-full relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d{0,12}$/.test(val)) {
                                onChange(val);
                            }
                        }}
                        className="block w-full pr-24 p-2.5 rounded-md  shadow-sm  focus:ring-0 dark:bg-gray-800 dark:text-gray-300"
                        placeholder="XXXX XXXX XXXX"
                        maxLength={12}
                        inputMode="numeric"
                        disabled={isVerified || disabled}
                        required={isRequired}
                    />

                    {!isVerified ? (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            className="absolute right-2 top-1/2 -translate-y-1/2 py-1 px-3 text-sm font-medium text-gray-600 hover:text-indigo-600"
                            disabled={processing || countdown > 0}
                        >
                            {processing
                                ? "Sending..."
                                : countdown > 0
                                    ? `Resend OTP ${countdown}s`
                                    : otpSent
                                        ? "Resend OTP"
                                        : "Get OTP"}
                        </button>

                    ) : (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 font-semibold">
                            ✅ Verified
                        </span>
                    )}
                </div>

                {/* OTP Inputs */}
                {otpDetails?.status && !isVerified && (
                    <div className="flex flex-wrap items-center gap-2">
                        {otpInputs.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-10 h-12 text-center text-lg font-bold border rounded-md dark:bg-gray-700 dark:text-white"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                ref={(el) => (otpRefs.current[index] = el)}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={otpProcessing}
                            className="px-4 py-2 h-12 bg-indigo-600 text-white rounded-md"
                        >
                            {otpProcessing ? "Verifying..." : "✅ Verify OTP"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
