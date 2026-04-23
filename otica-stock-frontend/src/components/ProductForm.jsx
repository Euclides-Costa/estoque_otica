import React, { useState } from 'react';
import { X, Package, Eye, EyeOff } from 'lucide-react';

const ProductForm = ({ onClose, onSave }) => {
    const [productType, setProductType] = useState('ARMACAO');
    const [formData, setFormData] = useState({
        nome: '',
        sku: '',
        marca: '',
        quantidadeMinima: 5,
        precoVenda: 0,
        tipo: 'ARMACAO',
        grauEsferico: '',
        grauCilindrico: '',
        eixo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const productToSave = {
            ...formData,
            precoVenda: parseFloat(formData.precoVenda),
            quantidadeMinima: parseInt(formData.quantidadeMinima)
        };
        onSave(productToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 rounded-lg p-2">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Novo Produto</h2>
                            <p className="text-xs text-gray-500">Preencha as informações do produto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tipo de Produto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Produto
                        </label>
                        <div className="flex space-x-3">
                            {[
                                { value: 'ARMACAO', label: 'Armação', icon: '👓' },
                                { value: 'LENTE', label: 'Lente', icon: '🔍' }
                            ].map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => {
                                        setProductType(type.value);
                                        setFormData({ ...formData, tipo: type.value });
                                    }}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                                        productType === type.value
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="mr-2">{type.icon}</span>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Digite o nome do produto"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: LENTE-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marca *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.marca}
                                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Marca do produto"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço de Venda (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.precoVenda}
                                onChange={(e) => setFormData({ ...formData, precoVenda: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estoque Mínimo
                            </label>
                            <input
                                type="number"
                                value={formData.quantidadeMinima}
                                onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Abaixo disso, será considerado estoque baixo</p>
                        </div>
                    </div>

                    {/* Especificações para Lentes */}
                    {productType === 'LENTE' && (
                        <div className="border-t border-gray-200 pt-5">
                            <h3 className="text-md font-semibold text-gray-800 mb-4">Especificações da Lente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grau Esférico
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.grauEsferico}
                                        onChange={(e) => setFormData({ ...formData, grauEsferico: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: -2.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grau Cilíndrico
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.grauCilindrico}
                                        onChange={(e) => setFormData({ ...formData, grauCilindrico: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: -0.75"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Eixo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.eixo}
                                        onChange={(e) => setFormData({ ...formData, eixo: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: 180"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;