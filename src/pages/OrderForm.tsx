import { Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetOrderQuery,
} from '../services/orders';
import { useGetProductsQuery } from '../services/products';

export default function OrderForm() {
  const { id } = useParams();
  const isEdit = !!id;

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [productsSelected, setProductsSelected] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<{ id: number; quantity: number } | undefined>(undefined);

  const { data: products = [], isLoading: loadingProducts, isError } = useGetProductsQuery();
  const { data: orderData, isLoading: loadingOrder } = useGetOrderQuery(Number(id), { skip: !isEdit });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const isLoading = loadingProducts || (isEdit && loadingOrder) || isCreating || isUpdating;

  const productCount = productsSelected.length;
  const finalPrice = productsSelected.reduce((sum, p) => sum + p.total, 0);

  useEffect(() => {
    if (orderData) {
      setProductsSelected(
        orderData.orderItems.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          unitPrice: item.product.unitPrice,
          quantity: item.quantity,
          total: item.subtotal,
        }))
      );
    }
  }, [orderData]);

  const handleAddProduct = (product: any, quantity: number) => {
    setProductsSelected((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity, total: (p.quantity + quantity) * p.unitPrice }
            : p
        );
      }
      return [...prev, { id: product.id, name: product.name, unitPrice: product.unitPrice, quantity, total: quantity * product.unitPrice }];
    });
    setProductToEdit(undefined);
    setShowModal(false);
  };

  const onEditProduct = (product: any, quantity: number) => {
    setProductsSelected((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, quantity, total: quantity * product.unitPrice }
          : p
      )
    );
  };

  const handleEditProduct = (id: number) => {
    const product = productsSelected.find((p) => p.id === id);
    if (product) {
      setProductToEdit({ id: product.id, quantity: product.quantity });
      setShowModal(true);
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProductsSelected((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async () => {
    if (productsSelected.length === 0) return;

    const payload = {
      orderNumber: isEdit ? orderData?.orderNumber : Math.floor(Math.random() * 10000),
      totalPrice: finalPrice,
      orderItems: productsSelected.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        subtotal: p.total,
      })),
    };

    if (isEdit) {
      await updateOrder({ id: Number(id), data: payload });
    } else {
      await createOrder(payload);
    }

    navigate('/my-orders');
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-600">Error loading products</p>;

  return (
    <>
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddProduct}
        onEdit={onEditProduct}
        products={products}
        editingProduct={productToEdit}
      />
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold mb-1">{isEdit ? 'Edit Order' : 'Add Order'}</h2>
          <p className="text-gray-600 mb-6">
            {isEdit ? 'Update an existing order' : 'Create a new order with products'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div>
              <label className="text-sm text-gray-700">Date</label>
              <input
                type="text"
                disabled
                value={today}
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700"># Products</label>
              <input
                type="text"
                disabled
                value={productCount}
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Final Price</label>
              <input
                type="text"
                disabled
                value={`$${finalPrice.toFixed(2)}`}
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Products</h3>
            <button
              onClick={() => {
                setProductToEdit(undefined);
                setShowModal(true);
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Total Price</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsSelected.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No products added yet
                    </td>
                  </tr>
                ) : (
                  productsSelected.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">${p.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">{p.quantity}</td>
                      <td className="px-4 py-2">${p.total.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEditProduct(p.id)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(p.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={productsSelected.length === 0 || isCreating || isUpdating}
              className={`px-6 py-2 rounded text-white font-medium transition ${
                productsSelected.length === 0 || isCreating || isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-900'
              }`}
            >
              {isCreating || isUpdating
                ? 'Saving...'
                : isEdit
                ? 'Update Order'
                : 'Create Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
