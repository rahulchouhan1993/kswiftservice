<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Tax Invoice</title>

    <style>
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
            color: #0A2540;
            margin: 0;
            padding: 0;
        }

        .invoice {
            width: 100%;
            border-top: 5px solid #1EA7E1;
        }

        .invoice-inner {
            padding: 5mm;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
        }

        .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #1EA7E1;
        }

        .invoice-title {
            font-size: 14px;
            font-weight: bold;
            color: #0A2540;
        }

        .muted {
            font-size: 10.5px;
            color: #475569;
            line-height: 1.6;
        }

        .right {
            text-align: right;
        }

        /* Bill To Section */
        .bill-table {
            margin-top: 18px;
            background: #EAF6FB;
            border: 1px solid #D1E9F4;
        }

        .bill-table td {
            padding: 10px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            color: #1EA7E1;
            margin-bottom: 4px;
        }

        /* Items Table */
        .items {
            margin-top: 20px;
        }

        .items th {
            background: #F0F9FD;
            color: #0A2540;
            border: 1px solid #D1E9F4;
            padding: 8px;
        }

        .items td {
            border: 1px solid #D1E9F4;
            padding: 8px;
        }

        .items th:last-child,
        .items td:last-child {
            text-align: right;
        }

        /* Totals */
        .total-section {
            margin-top: 20px;
        }

        .totals {
            width: 300px;
            float: right;
        }

        .totals td {
            border: 1px solid #D1E9F4;
            padding: 7px;
        }

        .total-highlight {
            background: #1EA7E1;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
        }

        .logo {
            width: 120px;
        }

        .footer-note {
            margin-top: 35px;
            padding-top: 10px;
            border-top: 1px solid #D1E9F4;
            text-align: center;
            font-size: 11px;
            color: #0A2540;
        }

        .clear {
            clear: both;
        }
    </style>
</head>

<body>

    @php
        $platformFeeTotal = 1000;
        $platformFeeGst = $platformFeeTotal * 0.18;
        $platformFeeBase = $platformFeeTotal - $platformFeeGst;

        $subtotal = $platformFeeBase;
        $totalGst = $platformFeeGst;
        $grandTotal = $platformFeeTotal;
    @endphp

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

            <!-- BILL TO -->
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
                    <tr>
                        <td>1</td>
                        <td>Platform Fee</td>
                        <td>₹{{ number_format($platformFeeBase, 2) }}</td>
                        <td>₹{{ number_format($platformFeeGst, 2) }}</td>
                        <td>₹{{ number_format($platformFeeTotal, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- TOTALS -->
            <table class="total-section">
                <tr>
                    <td style="width:40%;">
                        <img src="https://kswiftservices.com/build/assets/swiftlogo-BEnPYXWh.png" class="logo"
                            alt="KSwift Logo">
                    </td>

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
                                <td class="total-highlight">Grand Total</td>
                                <td class="total-highlight right">
                                    ₹{{ number_format($grandTotal, 2) }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div class="clear"></div>

            <!-- FOOTER -->
            <div class="footer-note">
                If you have any queries, feel free to write to
                <strong>info@kswiftservices.com</strong>
            </div>

        </div>
    </div>

</body>

</html>
