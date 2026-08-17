export const ORDER_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
} as const;

export const ORDERS_PER_PAGE = 8;

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

export const ORDER_STATUS_STYLES: Record<
    string,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700",
    },
    processing: {
        label: "Processing",
        className: "bg-blue-50 text-blue-700",
    },
    shipped: {
        label: "Shipped",
        className: "bg-blue-50 text-blue-700",
    },
    delivered: {
        label: "Delivered",
        className: "bg-green-50 text-green-700",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700",
    },
};

export const PAYMENT_STATUS_STYLES: Record<
    string,
    { label: string; className: string }
> = {
    pending: {
        label: "Payment Pending",
        className: "bg-amber-50 text-amber-700",
    },
    paid: {
        label: "Paid",
        className: "bg-green-50 text-green-700",
    },
    failed: {
        label: "Payment Failed",
        className: "bg-red-50 text-red-700",
    },
    refunded: {
        label: "Refunded",
        className: "bg-slate-100 text-slate-600",
    },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    jazzcash: "JazzCash",
};
