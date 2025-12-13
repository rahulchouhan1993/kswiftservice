<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Tax Invoice</title>

    <style>
        .logo {
            width: 120px;
            height: auto;
        }

        .total-section {
            width: 100%;
            margin-top: 15px;
        }

        .total-section td {
            vertical-align: top;
        }


        @font-face {
            font-family: 'DejaVu Sans';
            src: url("{{ public_path('fonts/DejaVuSans.ttf') }}") format('truetype');
        }

        @page {
            size: A4 portrait;
            margin: 15mm;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .invoice {
            width: 100%;
            border-top: 4px solid #17a2b8;
        }

        .invoice-inner {
            padding: 5mm;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table {
            page-break-inside: auto;
        }

        tr {
            page-break-inside: avoid;
        }

        thead {
            display: table-header-group;
        }

        .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #17a2b8;
        }

        .invoice-title {
            font-size: 14px;
            font-weight: bold;
        }

        .muted {
            font-size: 10.5px;
            color: #666;
            line-height: 1.6;
        }

        .right {
            text-align: right;
        }

        .bill-table {
            margin-top: 18px;
            background: #f7f7f7;
        }

        .bill-table td {
            padding: 10px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            color: #17a2b8;
            margin-bottom: 4px;
        }

        .items {
            margin-top: 20px;
        }

        .items th {
            background: #f3f3f3;
            border: 1px solid #ddd;
            padding: 8px;
        }

        .items td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .items th:last-child,
        .items td:last-child {
            text-align: right;
        }

        .total-wrapper {
            margin-top: 15px;
        }

        .totals {
            width: 300px;
            float: right;
        }

        .totals td {
            border: 1px solid #ddd;
            padding: 7px;
        }

        .total-highlight {
            background: #17a2b8;
            color: #fff;
            font-weight: bold;
            font-size: 13px;
        }

        .footer {
            margin-top: 45px;
            font-size: 10.5px;
        }

        .footer strong {
            color: #17a2b8;
        }

        .clear {
            clear: both;
        }

        .footer-note {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #c10808;
        }
    </style>
</head>

<body>

    <div class="invoice">
        <div class="invoice-inner">

            <!-- HEADER -->
            <table>
                <tr>
                    <td>
                        <div class="company-name">KSwift Services</div>
                        <div class="muted">
                            #14 & 1, Chowdeshwari Layout, Near ABS Bricks Factory<br>
                            Honnenahalli, Yelahanka, B.B.M.P North, Karnataka — 560064<br>
                            GST No: 29BPWPG1624J1ZG
                        </div>
                    </td>
                    <td class="right">
                        <div class="invoice-title">Tax Invoice</div>
                        <div class="muted">
                            Invoice No: {{ strtoupper($payment->invoice_no) }}<br>
                            Date: {{ $payment->created_at->format('d M Y') }}
                        </div>
                    </td>
                </tr>
            </table>

            <table class="bill-table">
                <tr>
                    <td style="width:50%;">
                        <div class="label">Bill To</div>
                        <div class="muted">
                            <strong>{{ $payment->user->name }}</strong><br>

                            {{ $payment->user->email }}<br>
                            Phone: {{ $payment->user->phone ?? '-' }}<br>

                            @if ($payment->user->default_address)
                                {{ $payment->user->default_address->address }}<br>

                                {{ optional($payment->user->default_address->city)->name }},
                                {{ optional($payment->user->default_address->state)->name }}
                                - {{ $payment->user->default_address->pincode }}
                            @else
                                <em>Address not available</em>
                            @endif
                        </div>
                    </td>
                    <td class="right">
                        <div class="label">Vehicle Details</div>
                        <div class="muted">
                            {{ $payment->booking->vehicle->vehicle_number }},
                            {{ $payment->booking->vehicle->model }} -
                            {{ $payment->booking->vehicle->vehicle_year }}
                        </div>
                        <div class="muted">
                            {{ ucwords(str_replace('_', ' ', $payment->booking->vehicle->vehicle_type)) }},
                            {{ ucwords($payment->booking->vehicle->fuel_type) }},
                            {{ ucwords($payment->booking->vehicle->vehile_make->name) }}
                        </div>
                    </td>
                </tr>
            </table>

            <!-- ITEMS -->
            @php
                $subtotal = 0;
                $totalGst = 0;
            @endphp

            <table class="items">
                <thead>
                    <tr>
                        <th style="width:40px">ID</th>
                        <th>Description</th>
                        <th style="width:110px">Amount (₹)</th>
                        <th style="width:110px">GST (18%) (₹)</th>
                        <th style="width:130px">Total (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($payment->booking->services as $i => $item)
                        @php
                            $totalPrice = $item->service_type->base_price; // GST included
                            $baseAmount = $totalPrice / 1.18;
                            $gstAmount = $totalPrice - $baseAmount;

                            $subtotal += $baseAmount;
                            $totalGst += $gstAmount;
                        @endphp
                        <tr>
                            <td>{{ $i + 1 }}</td>
                            <td>{{ $item->service_type->name }}</td>
                            <td>₹{{ number_format($baseAmount, 2) }}</td>
                            <td>₹{{ number_format($gstAmount, 2) }}</td>
                            <td>₹{{ number_format($totalPrice, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            @php
                $grandTotal = $subtotal + $totalGst - 1000;
            @endphp

            <div class="total-wrapper">
                <table class="total-section">
                    <tr>
                        <!-- LOGO -->
                        <td style="width:40%;">
                            <img src="https://kswiftservices.com/build/assets/swiftlogo-BEnPYXWh.png" class="logo"
                                alt="KSwift Logo">
                        </td>

                        <!-- TOTALS -->
                        <td style="width:60%;" class="right">
                            <table class="totals">
                                <tr>
                                    <td>Sub Total (Without GST)</td>
                                    <td class="right">₹{{ number_format($subtotal, 2) }}</td>
                                </tr>
                                <tr>
                                    <td>Total GST (18%)</td>
                                    <td class="right">₹{{ number_format($totalGst, 2) }}</td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td class="right">₹{{ number_format(0, 2) }}</td>
                                </tr>
                                <tr>
                                    <td>Upfront Amount</td>
                                    <td class="right">- ₹{{ number_format(1000, 2) }}</td>
                                </tr>
                                <tr>
                                    <td class="total-highlight">Grand Total</td>
                                    <td class="total-highlight right">
                                        ₹{{ number_format($grandTotal, 2) }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="clear"></div>

            <div class="footer-note">
                If you have any queries, then feel free to write us at
                <strong>info@kswiftservices.com</strong>
            </div>

        </div>
    </div>

</body>

</html>
