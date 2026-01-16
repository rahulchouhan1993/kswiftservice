import {
    Chart as ChartJS,

    // ✅ Controllers (REQUIRED for mixed charts)
    BarController,
    LineController,

    // ✅ Scales
    CategoryScale,
    LinearScale,

    // ✅ Elements
    BarElement,
    LineElement,
    PointElement,

    // ✅ Plugins
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// ✅ Explicit registration (production-safe)
ChartJS.register(
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

export default function DashboardStatsBarChart({ reports }) {
    // 🔹 Extract data from single reports object
    const months = Object.keys(reports ?? {});

    const bookings = months.map(
        (month) => reports?.[month]?.bookings ?? 0
    );

    const revenue = months.map(
        (month) => reports?.[month]?.revenue ?? 0
    );

    const data = {
        labels: months,
        datasets: [
            {
                type: "bar",
                label: "Revenue (₹)",
                data: revenue,
                backgroundColor: "rgba(14, 165, 233, 0.7)",
                borderRadius: 6,
                yAxisID: "yRevenue",
            },
            {
                type: "line",
                label: "Bookings",
                data: bookings,
                borderColor: "rgba(99, 102, 241, 1)",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                tension: 0.4,
                pointRadius: 4,
                yAxisID: "yBookings",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.label.includes("Revenue")) {
                            return `₹ ${Number(ctx.raw).toLocaleString()}`;
                        }
                        return `${ctx.raw} bookings`;
                    },
                },
            },
        },
        scales: {
            yRevenue: {
                type: "linear",
                position: "left",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Revenue",
                },
            },
            yBookings: {
                type: "linear",
                position: "right",
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: "Bookings",
                },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    return (
        <div className="h-[320px] w-full">
            <Bar data={data} options={options} />
        </div>
    );
}
