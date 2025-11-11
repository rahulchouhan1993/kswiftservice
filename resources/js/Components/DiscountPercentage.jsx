import React, { useMemo, useEffect, useState } from "react";
import { useAlerts } from "./Alerts";

export default function DiscountPercentage({ originalPrice, currentPrice }) {
    const { successAlert, errorAlert, errorsHandling } = useAlerts();
    const [showError, setShowError] = useState(false);

    const discount = useMemo(() => {
        if (!originalPrice || !currentPrice) return 0;
        const op = parseFloat(originalPrice);
        const cp = parseFloat(currentPrice);
        if (isNaN(op) || isNaN(cp) || op === 0) return 0;

        if (cp > op) {
            setShowError(true);
            return null;
        } else {
            setShowError(false);
            return ((op - cp) / op) * 100;
        }
    }, [originalPrice, currentPrice]);

    useEffect(() => {
        if (showError) {
            errorAlert("Current price cannot be greater than original price!");
        }
    }, [showError]);

    return (
        <span className="text-xs">
            {discount !== null ? `${discount.toFixed(2)}%` : ""}
        </span>
    );
}
