<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Site Under Maintenance</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center px-4">

    <div class="rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        <img src="{{ asset('images/common/idmitra_logo_wbg.png') }}" alt="Logo" class="mx-auto mb-6">
        
        <h1 class="text-3xl font-bold text-gray-800 mb-4">We'll Be Back Soon!</h1>
        <p class="text-gray-600 text-lg mb-6">
            Our site is currently undergoing scheduled maintenance.<br>
            Thank you for your patience and understanding.
        </p>

        <div class="flex items-center justify-center space-x-4 mt-4">
            <svg class="w-6 h-6 text-yellow-500 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4V2m0 20v-2m8.485-8.485l1.414-1.414M4.222 19.778l1.414-1.414M20 12h2M2 12h2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414"/>
            </svg>
            <span class="text-gray-500 text-sm">System maintenance in progress</span>
        </div>

        <footer class="mt-6 text-sm text-gray-400">
            &copy; {{ date('Y') }} IdMitra.com All rights reserved.
        </footer>
    </div>

</body>
</html>
