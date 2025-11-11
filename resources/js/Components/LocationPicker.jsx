// resources/js/Components/LocationPicker.jsx
import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAlerts } from "./Alerts";

export default function LocationPicker({ value, onChange }) {
    const { errorAlert } = useAlerts();

    const [latitude, setLatitude] = useState(value?.latitude || "");
    const [longitude, setLongitude] = useState(value?.longitude || "");
    const [locationLink, setLocationLink] = useState(value?.location_link || "");
    const [accuracy, setAccuracy] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            errorAlert("Geolocation is not supported by this browser.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const acc = position.coords.accuracy; // accuracy in meters

                setLatitude(lat);
                setLongitude(lng);
                setAccuracy(acc);

                const link = `https://www.google.com/maps?q=${lat},${lng}`;
                setLocationLink(link);

                onChange({ latitude: lat, longitude: lng, location_link: link, accuracy: acc });

                setMapLoaded(true);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                console.error("Error fetching location:", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorAlert("Location permission denied. Please allow access.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorAlert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        errorAlert("Location request timed out.");
                        break;
                    default:
                        errorAlert("Unable to fetch location. Please try again.");
                }
            },
            {
                enableHighAccuracy: true, // request GPS for better accuracy
                timeout: 15000,           // wait up to 15s
                maximumAge: 0             // don’t use cached location
            }
        );
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-[#0a0e37] rounded-lg shadow-md border border-gray-200 dark:border-blue-950">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white pb-2 mb-2">
                <FaMapMarkerAlt className="text-red-500" />
                School Location
            </h2>

            <PrimaryButton type="button" onClick={fetchLocation} disabled={loading}>
                {loading ? "Fetching..." : "Get Current Location"}
            </PrimaryButton>

            {mapLoaded && (
                <>
                    <iframe
                        title="Google Map"
                        width="100%"
                        height="250"
                        className="mt-3 rounded-lg border"
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=18&output=embed`}
                    ></iframe>

                    <div className="mt-3 grid md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Latitude" />
                            <TextInput
                                type="text"
                                value={latitude}
                                readOnly
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <InputLabel value="Longitude" />
                            <TextInput
                                type="text"
                                value={longitude}
                                readOnly
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    {accuracy !== null && (
                        <div className="mt-3">
                            <InputLabel value="Accuracy (meters)" />
                            <TextInput
                                type="text"
                                value={`${accuracy.toFixed(2)} m`}
                                readOnly
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                        </div>
                    )}

                    <div className="mt-3">
                        <InputLabel value="Google Maps Link" />
                        <TextInput
                            type="text"
                            value={locationLink}
                            readOnly
                            className="bg-gray-100 dark:bg-gray-800"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
