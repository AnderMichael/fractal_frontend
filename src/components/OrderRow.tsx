import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  date: string;
  total: number;
}

interface Props {
  order: Order;
  onDelete: (id: number) => void;
}

export default function OrderRow({ order, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-2 px-4">{order.id}</td>
      <td className="py-2 px-4">{order.orderNumber}</td>
      <td className="py-2 px-4"><StatusBadge status={order.status} /></td>
      <td className="py-2 px-4">{order.date}</td>
      <td className="py-2 px-4">${order.total.toFixed(2)}</td>
      <td className="py-2 px-4 flex justify-center gap-3">
        <button onClick={() => navigate(`/add-order/${order.id}`)} className="text-blue-600 hover:text-blue-800">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-800">
          <Trash size={18} />
        </button>
      </td>
    </tr>
  );
}