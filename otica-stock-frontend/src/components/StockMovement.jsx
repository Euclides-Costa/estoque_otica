import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const StockMovement = ({ products, onClose, onSave }) => {
    const [movementType, setMovementType] = useState('ENTRADA');
    const [formData, setFormData] = useState({
        productId: '',
        quantity: 1,
        loteCodigo: '',
        validade: '',
        notaFiscal: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            type: movementType,
            quantity: parseInt(formData.quantity),
            productId: parseInt(formData.productId)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        {movementType === 'ENTRADA' ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <h2 className="text-lg font-semibold text-gray-800">
                            {movementType === 'ENTRADA' ? 'Registrar Entrada' : 'Registrar Saída'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Movimento
                        </label>
                        <div className="flex space-x-3">
                            {[
                                { value: 'ENTRADA', label: 'Entrada (Compra)', icon: '📥' },
                                { value: 'SAIDA', label: 'Saída (Venda)', icon: '📤' }
                            ].map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setMovementType(type.value)}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                                        movementType === type.value
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{type.icon}</span>
                                    <span className="text-sm">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Produto *
                        </label>
                        <select
                            required
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecione um produto</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.nome} - {product.sku} (Estoque: {product.quantidadeAtual})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantidade *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {movementType === 'ENTRADA' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código do Lote *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.loteCodigo}
                                    onChange={(e) => setFormData({ ...formData, loteCodigo: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: LOTE001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Validade
                                </label>
                                <input
                                    type="date"
                                    value={formData.validade}
                                    onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nota Fiscal
                                </label>
                                <input
                                    type="text"
                                    value={formData.notaFiscal}
                                    onChange={(e) => setFormData({ ...formData, notaFiscal: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="NF001"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockMovement;