interface Props {
    status: string;
}

export default function StatusBadge({ status }: Props) {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    const colors: Record<string, string> = {
        Delivered: "bg-green-100 text-green-800",
        Processing: "bg-yellow-100 text-yellow-800",
        Shipped: "bg-blue-100 text-blue-800",
        Pending: "bg-gray-100 text-gray-800",
    };

    return <span className={`${base} ${colors[status] || "bg-gray-200"}`}>{status}</span>;
}
