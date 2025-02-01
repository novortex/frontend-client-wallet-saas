import { formatToTwoDecimalPlaces } from "@/utils/formatToTwoDecimalPlates";
import React from "react";

interface KpiCardProps {
    title: string;
    value: number | null; // Allow null values
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
    const isPositive = value !== null && value > 0;
    const isNegative = value !== null && value < 0;

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-64 text-center border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-2xl flex items-center justify-center">
                {!value
                    ? "-"
                    : (
                        <>
                            {isPositive && <span className="text-green-500 mr-1">⬆</span>}
                            {isNegative && <span className="text-red-500 mr-1">⬇</span>}
                            <span>{`$ ${formatToTwoDecimalPlaces(value)}`}</span>
                        </>
                    )}
            </p>
        </div>
    );
};

export default KpiCard;
