export const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};
