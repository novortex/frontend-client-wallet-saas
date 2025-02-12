import { formatToTwoDecimalPlaces } from "@/utils/formatToTwoDecimalPlates";
import React from "react";

interface KpiCardProps {
    title: string;
    performance: string | number;
    percentagePerformance: string;
    startDateUsed?: string;
    endDateUsed?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, performance, percentagePerformance, startDateUsed, endDateUsed }) => {

    // Handle missing performance values correctly
    const isMissingData = performance === "" || performance === "-";
    const performanceValue = !isMissingData ? Number(performance) : null;
    const isPositive = performanceValue !== null && performanceValue > 0;
    const isNegative = performanceValue !== null && performanceValue < 0;

    // Format dates properly, ensuring they are valid
    const formatDate = (date?: string) =>
        date && date !== "-" ? new Date(date).toLocaleDateString() : "N/A";

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-full max-w-xs text-center border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {/* Performance Display */}
            <p className="text-2xl flex items-center justify-center">
                {isMissingData ? (
                    <span className="text-gray-400 text-sm">Missing wallet registers for this period</span>
                ) : (
                    <>
                        {isPositive && <span className="text-green-500 mr-1">⬆</span>}
                        {isNegative && <span className="text-red-500 mr-1">⬇</span>}
                        <span>{percentagePerformance}</span>
                    </>
                )}
            </p>

            {/* Percentage Performance */}
            {!isMissingData && (
                <p className="text-lg text-gray-400 mt-1">{`$ ${formatToTwoDecimalPlaces(performanceValue ?? 0)}`}</p>
            )}

            {/* Display Start and End Dates only if they exist */}
            {startDateUsed && endDateUsed && (
                <div className="text-gray-400 text-sm mt-2">
                    <p>📅 {formatDate(startDateUsed)} → {formatDate(endDateUsed)}</p>
                </div>
            )}
        </div>
    );
};

export default KpiCard;
