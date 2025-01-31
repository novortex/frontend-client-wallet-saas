import { formatToTwoDecimalPlaces } from "@/utils/formatToTwoDecimalPlates";
import React from "react";

interface KpiCardProps {
    title: string;
    value: number | null;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-64 text-center border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-2xl">
                {!value ? '-' : `$ ${formatToTwoDecimalPlaces(value)}`}
            </p>
        </div>
    );
};

export default KpiCard;
