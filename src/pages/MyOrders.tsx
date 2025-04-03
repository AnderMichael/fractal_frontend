import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';
import { useDeleteOrderMutation, useGetOrdersQuery } from '../services/orders';

export default function MyOrders() {
    const navigate = useNavigate();
    const { data: orders = [], isLoading } = useGetOrdersQuery();
    const [deleteOrder] = useDeleteOrderMutation();

    const handleDelete = async (id: number) => {
        const numericId = id;
        if (confirm('Are you sure?')) {
            await deleteOrder(numericId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">My Orders</h2>
                        <p className="text-gray-600">View and manage your order history</p>
                    </div>
                    <button
                        onClick={() => navigate('/add-order')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Order
                    </button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <OrdersTable
                        orders={orders.map((o, index) => ({
                            id: o.id,
                            orderNumber: `ORD-${index + 1}`,
                            status: 'Pending',
                            date: new Date(o.createdAt).toLocaleDateString(),
                            total: o.totalPrice,
                        }))}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
