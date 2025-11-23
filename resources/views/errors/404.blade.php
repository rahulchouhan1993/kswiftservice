<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Page Not Found - 404</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center px-4">

    <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        <img src="{{ asset('images/logo.jpg') }}" alt="Logo" class="mx-auto mb-6 w-auto h-28">

        <h1 class="text-6xl font-extrabold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Oops! Page Not Found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div class="flex justify-center space-x-4 mt-6">
            <a href="#"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold">
                Go Back
            </a>
        </div>

        <div class="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400 dark:text-gray-500">
            <svg class="w-5 h-5 text-red-500 animate-bounce" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span>Page could not be found</span>
        </div>

        <footer class="mt-6 text-sm text-gray-400 dark:text-gray-500">
            &copy; {{ date('Y') }} All rights reserved.
        </footer>
    </div>

</body>

</html>
