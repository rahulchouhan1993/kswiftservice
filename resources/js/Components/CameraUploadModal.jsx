import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    MdCamera,
    MdClose,
    MdFileUpload,
    MdFlipCameraAndroid,
} from "react-icons/md";
import Cropper from "react-easy-crop";

export default function CameraUploadModal({
    isOpen,
    onClose,
    onImageCaptured,
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [devices, setDevices] = useState([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [preview, setPreview] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);

    // for ascept ratio adjust'
    const [aspectRatio, setAspectRatio] = useState(1); // Default: square

    useEffect(() => {
        if (isOpen) {
            const initializeCamera = async () => {
                try {
                    let constraints = {
                        video: { facingMode: { exact: "environment" } },
                    };

                    try {
                        const stream =
                            await navigator.mediaDevices.getUserMedia(
                                constraints
                            );
                        setStream(stream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                    } catch (err) {
                        // fallback to default camera if environment camera fails
                        const fallbackStream =
                            await navigator.mediaDevices.getUserMedia({
                                video: true,
                            });
                        setStream(fallbackStream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = fallbackStream;
                        }
                    }

                    const allDevices =
                        await navigator.mediaDevices.enumerateDevices();
                    const videoDevices = allDevices.filter(
                        (device) => device.kind === "videoinput"
                    );
                    setDevices(videoDevices);

                    // Set current index to the one that matches environment if available
                    const environmentIndex = videoDevices.findIndex((device) =>
                        /back|environment/i.test(device.label)
                    );
                    setCurrentCameraIndex(
                        environmentIndex >= 0 ? environmentIndex : 0
                    );
                } catch (err) {
                    console.error("Camera initialization error:", err);
                }
            };

            initializeCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async (deviceId) => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
            setStream(s);
        } catch (err) {
            console.error("Camera start error:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const handleFlipCamera = async () => {
        if (devices.length <= 1) return;
        stopCamera();
        const nextIndex = (currentCameraIndex + 1) % devices.length;
        await startCamera(devices[nextIndex].deviceId);
        setCurrentCameraIndex(nextIndex);
    };

    const resetStates = () => {
        setPreview(null);
        setImageToCrop(null);
        setIsCropping(false);
        setBrightness(100);
        setContrast(100);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        setImageToCrop(dataUrl);
        setIsCropping(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImageToCrop(ev.target.result);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = useCallback(async () => {
        const image = new Image();
        image.src = imageToCrop;
        await new Promise((resolve) => (image.onload = resolve));
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const fileUrl = URL.createObjectURL(blob);
                resolve(fileUrl);
            }, "image/png");
        });
    }, [imageToCrop, croppedAreaPixels]);

    const handleCropAndSave = async () => {
        const croppedImageUrl = await getCroppedImg();
        setPreview(croppedImageUrl);
        setIsCropping(false);
        setImageToCrop(null);
        stopCamera();
    };

    const handleSave = () => {
        if (preview) {
            onImageCaptured(preview);
            stopCamera();
            resetStates();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 w-screen">
            <div className="bg-white dark:bg-[#0a0e25] rounded-xl p-2 sm:p-6 w-full max-w-md shadow-xl relative m-1">
                <button
                    onClick={() => {
                        stopCamera();
                        resetStates();
                        onClose();
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white"
                >
                    <MdClose size={20} />
                </button>

                <h2 className="sm:text-xl text-lg w-full font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-start gap-2">
                    <MdCamera /> Upload Photo
                </h2>

                <div className="flex items-center gap-2 mb-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={aspectRatio === 1}
                            onChange={() => setAspectRatio(1)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-600 rounded-sm focus:ring-green-500 dark:focus:ring-green-600 dark:ring-green-800 focus:ring-1 dark:bg-white dark:border-gray-600"
                        />
                        Square (1:1)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={aspectRatio === 5 / 6}
                            onChange={() => setAspectRatio(5 / 6)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-600 rounded-sm focus:ring-green-500 dark:focus:ring-green-600 dark:ring-green-800 focus:ring-1 dark:bg-white dark:border-gray-600"
                        />
                        Porttrait (5:6)
                    </label>
                </div>

                {isCropping ? (
                    <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />

                        <span
                            onClick={handleCropAndSave}
                            className="cursor-pointer absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Crop & Save
                        </span>
                    </div>
                ) : preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full rounded-lg mb-4 object-contain max-h-80"
                            style={{
                                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                            }}
                        />
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Brightness: {brightness}%
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={brightness}
                                    onChange={(e) =>
                                        setBrightness(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Contrast: {contrast}%
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={contrast}
                                    onChange={(e) =>
                                        setContrast(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg mb-4 max-h-80 object-contain"
                        />
                        {devices.length > 1 && (
                            <span
                                onClick={handleFlipCamera}
                                className="cursor-pointer absolute top-2 left-2 bg-gray-700 bg-opacity-60 text-white p-2 rounded-full hover:bg-gray-800"
                                title="Switch Camera"
                            >
                                <MdFlipCameraAndroid size={20} />
                            </span>
                        )}
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden"></canvas>

                <div className="flex justify-center gap-3">
                    {!preview && !isCropping && (
                        <span
                            onClick={captureImage}
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <MdCamera /> Capture
                        </span>
                    )}
                    {!isCropping && (
                        <label className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 cursor-pointer">
                            <MdFileUpload /> Choose File
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    {preview && !isCropping && (
                        <button
                            onClick={handleSave}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
