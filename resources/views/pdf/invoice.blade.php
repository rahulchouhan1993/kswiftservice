<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Invoice</title>

    <style>
        /* Load Unicode Font for Rupee Symbol */
        @font-face {
            font-family: 'DejaVu Sans';
            font-style: normal;
            font-weight: normal;
            src: url("{{ public_path('fonts/DejaVuSans.ttf') }}") format('truetype');
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            padding: 30px;
            background: #f7f7f7;
        }

        .invoice-box {
            background: #ffffff;
            padding: 40px 50px;
            border-radius: 12px;
            box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.08);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header img {
            height: 60px;
        }

        .title {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #333;
            text-align: right;
        }

        .subtitle {
            font-size: 13px;
            font-weight: bold;
            color: #C89B3C;
            text-align: right;
            margin-top: -5px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 30px;
            color: #444;
            border-left: 4px solid #C89B3C;
            padding-left: 10px;
        }

        /* Table with auto page break */
        table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
            page-break-inside: auto;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        thead {
            display: table-header-group;
        }

        th {
            background: #333;
            color: white;
            padding: 10px;
            font-size: 14px;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }

        .amount-box {
            margin-top: 20px;
            float: right;
            width: 320px;
            padding: 20px;
            background: #f3f3f3;
            border-radius: 10px;
        }

        .grand-total {
            font-size: 20px;
            font-weight: bold;
            color: #C89B3C;
        }

        .footer-text {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>

<body>

    <div class="invoice-box">

        {{-- HEADER --}}
        <div class="header">
            {{--  <img src="{{ asset('logo.png') }}" alt="Logo">  --}}

            <div>
                <div class="title">INVOICE</div>
                <div class="subtitle">(Kswiftservices.com)</div>

                <div style="text-align:right; margin-top:10px;">
                    <div><strong>Date:</strong> {{ $payment->created_at->format('d M Y') }}</div>
                    <div><strong>Transaction ID:</strong> {{ $payment->txnId }}</div>
                </div>
            </div>
        </div>

        {{-- BOOKING DETAILS --}}
        <div class="section-title">Booking Details</div>
        <p><strong>Booking ID:</strong> {{ $payment->booking->booking_id }}</p>
        <p><strong>Service Date:</strong> {{ $payment->booking->date }}</p>

        {{-- VEHICLE DETAILS --}}
        <div class="section-title">Vehicle Information</div>
        <p><strong>Vehicle No:</strong> {{ $payment->booking->vehicle->vehicle_number }}</p>
        <p><strong>Make:</strong> {{ $payment->booking->vehicle->vehile_make->name }}</p>
        <p><strong>Model:</strong> {{ $payment->booking->vehicle->model }}</p>

        {{-- SERVICES --}}
        <div class="section-title">Service Summary</div>

        @php $subtotal = 0; @endphp

        <table>
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th style="text-align:right;">Price (₹)</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($payment->booking->services as $item)
                    @php $subtotal += $item->service_type->base_price; @endphp

                    <tr>
                        <td>{{ $item->service_type->name }}</td>
                        <td style="text-align:right;">₹{{ number_format($item->service_type->base_price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $upfront = 1000;
            $grandTotal = $subtotal + $upfront;
        @endphp

        <div class="amount-box">
            <table width="100%">
                <tr>
                    <td>Subtotal:</td>
                    <td style="text-align:right;">₹{{ number_format($subtotal, 2) }}</td>
                </tr>

                <tr>
                    <td>Upfront Payment (GST Included):</td>
                    <td style="text-align:right;">- ₹{{ number_format($upfront, 2) }}</td>
                </tr>

                <tr>
                    <td class="grand-total">Grand Total:</td>
                    <td class="grand-total" style="text-align:right;">₹{{ number_format($grandTotal, 2) }}</td>
                </tr>
            </table>
        </div>

        <div style="clear: both;"></div>

        <div class="footer-text">
            Thank you for choosing our service.<br>
            For support, contact: support@kswiftservices.com
        </div>

    </div>

</body>

</html>
