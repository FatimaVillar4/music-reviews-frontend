import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

import "../styles/GenreChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const randomColor = (i) => {
    const palette = [
        "#16a34a", "#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#f97316"
    ];
    return palette[i % palette.length];
};

const GenreChart = ({ height = 240 }) => {
    const { t, i18n } = useTranslation();
    const reviews = useSelector((state) => state.reviews.listaReseñas || []);

    // Calcula conteo por género (useMemo para performance)
    const { labels, data } = useMemo(() => {
        const counts = reviews.reduce((acc, r) => {
            const g = r.genre?.name || "Sin género";
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const data = labels.map((l) => counts[l]);
        return { labels, data };
    }, [reviews]);

    if (reviews.length === 0) {
        return (
            <div className="genre-chart-card">
            <h5 className="genre-chart-title">{t("form.genrereviews")}</h5>
                <div className="genre-chart-empty">
                    <i className="fas fa-chart-pie"></i>
                    <p>{t("form.noreviews")}</p>
                    <small>{t("form.createfirstreview")}</small>
                </div>
            </div>
        );
    }

    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: labels.map((_, i) => randomColor(i)),
                borderColor: "rgba(0,0,0,0.25)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "right", labels: { color: "#cbd5d1" } },
            tooltip: { mode: "index" },
        },
    };

    return (
        <div className="genre-chart-card">
            <h5 className="genre-chart-title">{t("form.genrereviews")}</h5>
            <div className="genre-chart">
                <div className="genre-chart-wrap" style={{ height }}>
                    <Doughnut data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default GenreChart;