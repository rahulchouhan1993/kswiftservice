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
        $amount = $withdrawalRequest->amount ?? 0;
        $currentBalance = isset($current_balance) ? $current_balance : ($withdrawalRequest->mechanic->balence ?? 0);
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
                        <div class="invoice-title">Wallet {{ ucfirst($payment_type ?? 'debit') }} Invoice</div>
                        <div class="muted">
                            Invoice No: {{ strtoupper($invoice_no ?? '-') }}<br>
                            Date: {{ \Carbon\Carbon::parse($withdrawalRequest->created_at)->format('d M Y') }}
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
                            <strong>{{ $withdrawalRequest->mechanic->name }}</strong><br>
                            {{ $withdrawalRequest->mechanic->email }}<br>
                            Phone: {{ $withdrawalRequest->mechanic->phone ?? '-' }}<br>
                        </div>
                    </td>

                    <td class="right">
                        <div class="label">Transaction Details</div>
                        <div class="muted">
                            Type: {{ ucfirst($txn_type ?? 'debit') }}<br>
                            Status: {{ ucwords(str_replace('_', ' ', $withdrawalRequest->status)) }}
                        </div>
                    </td>
                </tr>
            </table>

            <!-- AMOUNT -->
            <table class="items">
                <thead>
                    <tr>
                        <th style="width:40px">ID</th>
                        <th>Description</th>
                        <th style="width:130px">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Withdrawal Amount</td>
                        <td>₹{{ number_format($amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- SUMMARY -->
            <table class="total-section">
                <tr>
                    <td style="width:40%;">
                        <img src="https://kswiftservices.com/build/assets/swiftlogo-BEnPYXWh.png" class="logo"
                            alt="KSwift Logo">
                    </td>
                    <td style="width:60%;" class="right">
                        <table class="totals">
                            <tr>
                                <td class="total-highlight">Current Wallet Balance</td>
                                <td class="total-highlight right">
                                    ₹{{ number_format($currentBalance, 2) }}
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
