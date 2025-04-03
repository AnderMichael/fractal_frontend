import OrderRow from './OrderRow';

interface Order {
    id: number;
    orderNumber: string;
    status: string;
    date: string;
    total: number;
}

interface Props {
    orders: Order[];
    onDelete: (id: number) => void;
}

export default function OrdersTable({ orders, onDelete }: Props) {
    return (
        <div className="bg-white shadow rounded-lg mt-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Order #</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <OrderRow key={order.id} order={order} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}