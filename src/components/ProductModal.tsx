// src/components/ProductModal.tsx
import { useEffect, useMemo, useState } from 'react';

interface Product {
    id: number;
    name: string;
    unitPrice: number;
}

interface Props {
    products: Product[];
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: Product, quantity: number) => void;
    onEdit: (product: Product, quantity: number) => void;
    editingProduct?: {
        id: number;
        quantity: number;
    };
}

export default function ProductModal({ products, isOpen, onClose, onAdd, editingProduct, onEdit }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (editingProduct) {
            setSelectedId(editingProduct.id);
            setQuantity(editingProduct.quantity);
        } else {
            setSelectedId(null);
            setQuantity(1);
        }
    }, [editingProduct])

    const selectedProduct = useMemo(() => {
        return products.find((p) => p.id === selectedId);
    }, [selectedId]);

    const handleEdit = () => {
        if (selectedProduct && quantity > 0) {
            onEdit(selectedProduct, quantity);
            setSelectedId(null);
            setQuantity(1);
            onClose();
        }
    }
    const handleAdd = () => {
        if (selectedProduct && quantity > 0) {
            onAdd(selectedProduct, quantity);
            setSelectedId(null);
            setQuantity(1);
            onClose();
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Product to Order</h3>

                <label className="block text-sm mb-1">Select Product</label>
                <select
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={selectedId || ''}
                    onChange={(e) => setSelectedId(e.target.value ? Number.parseInt(e.target.value) : null)}
                >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} - ${p.unitPrice}
                        </option>
                    ))}
                </select>

                <label className="block text-sm mb-1">Quantity</label>
                <input
                    id="quantity"
                    className="border rounded px-3 py-2 w-full mb-4"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    onBlur={(e) => { e.target.value.length === 0 ? setQuantity(1) : setQuantity(Math.max(1, Number.parseInt(e.target.value))) }} // Ensure quantity is at least 1
                    required
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-700">
                        Cancel
                    </button>
                    {editingProduct ? (
                        <button
                            onClick={handleEdit}
                            disabled={!selectedProduct || quantity < 1}
                            className={`px-4 py-2 rounded text-white ${selectedProduct && quantity > 0
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Update Product
                        </button>
                    ) : <button
                        onClick={handleAdd}
                        disabled={!selectedProduct || quantity < 1}
                        className={`px-4 py-2 rounded text-white ${selectedProduct && quantity > 0
                            ? 'bg-black hover:bg-gray-900'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Add to Order
                    </button>}

                </div>
            </div>
        </div>
    );
}

