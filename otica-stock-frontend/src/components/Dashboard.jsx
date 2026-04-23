import React, { useState, useEffect } from 'react';
import {
    Package, AlertTriangle, Calendar, DollarSign,
    TrendingUp, TrendingDown, Eye, Box, Truck,
    ArrowUpRight, ArrowDownRight, Search, Plus,
    X, CheckCircle, Clock
} from 'lucide-react';
import api from '../services/api';

const Dashboard = ({ products }) => {
    const [alertasEstoque, setAlertasEstoque] = useState([]);
    const [showMovementForm, setShowMovementForm] = useState(false);
    const [movementType, setMovementType] = useState('ENTRADA');
    const [movementData, setMovementData] = useState({
        productId: '',
        quantity: 1,
        loteCodigo: '',
        validade: '',
        notaFiscal: ''
    });

    useEffect(() => {
        const loadAlertas = async () => {
            try {
                const response = await api.get('/alertas/estoque-baixo');
                setAlertasEstoque(response.data);
            } catch (err) {
                console.error('Erro ao carregar alertas:', err);
            }
        };
        loadAlertas();
    }, [products]);

    const totalItems = products.reduce((sum, p) => sum + (p.quantidadeAtual || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantidadeAtual || 0) * (p.precoVenda || 0)), 0);
    const lowStockCount = alertasEstoque.length;

    const handleMovementSubmit = async (e) => {
        e.preventDefault();
        try {
            if (movementType === 'ENTRADA') {
                await api.post('/entrada', {
                    produtoId: parseInt(movementData.productId),
                    quantidade: parseInt(movementData.quantity),
                    loteCodigo: movementData.loteCodigo,
                    validade: movementData.validade,
                    notaFiscal: movementData.notaFiscal
                });
            } else {
                await api.post('/venda', {
                    produtoId: parseInt(movementData.productId),
                    quantidade: parseInt(movementData.quantity),
                    usuario: 'ADMIN'
                });
            }
            alert('Movimento registrado com sucesso!');
            setShowMovementForm(false);
            setMovementData({ productId: '', quantity: 1, loteCodigo: '', validade: '', notaFiscal: '' });
            window.location.reload();
        } catch (err) {
            alert('Erro ao registrar movimento');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Visão geral do seu estoque de ótica</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Cards e Tabela */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Card Total em Estoque */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-blue-100 rounded-lg p-2.5">
                                    <Package size={18} className="text-blue-600" />
                                </div>
                                <div className="flex items-center space-x-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={14} />
                                    <span>+12.5%</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{totalItems.toLocaleString('pt-BR')}</p>
                            <p className="text-sm text-gray-600 mt-1">Total em Estoque</p>
                            <p className="text-xs text-gray-400 mt-2">unidades</p>
                        </div>

                        {/* Card Valor em Estoque */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-green-100 rounded-lg p-2.5">
                                    <DollarSign size={18} className="text-green-600" />
                                </div>
                                <div className="flex items-center space-x-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={14} />
                                    <span>+8.2%</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Valor em Estoque</p>
                            <p className="text-xs text-gray-400 mt-2">valor total</p>
                        </div>
                    </div>

                    {/* Stats Cards Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Card Produtos Vencendo */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-yellow-100 rounded-lg p-2.5">
                                    <Calendar size={18} className="text-yellow-600" />
                                </div>
                                <div className="flex items-center space-x-1 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                                    <ArrowDownRight size={14} />
                                    <span>0 este mês</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">0</p>
                            <p className="text-sm text-gray-600 mt-1">Produtos Vencendo</p>
                            <p className="text-xs text-gray-400 mt-2">próximos 30 dias</p>
                        </div>

                        {/* Card Estoque Baixo */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-red-100 rounded-lg p-2.5">
                                    <AlertTriangle size={18} className="text-red-600" />
                                </div>
                                <div className={`flex items-center space-x-1 text-xs font-medium ${lowStockCount > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'} px-2 py-1 rounded-full`}>
                                    <ArrowUpRight size={14} />
                                    <span>{lowStockCount > 0 ? `+${lowStockCount}` : '0'}</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{lowStockCount}</p>
                            <p className="text-sm text-gray-600 mt-1">Estoque Baixo</p>
                            <p className="text-xs text-gray-400 mt-2">abaixo do mínimo</p>
                        </div>
                    </div>

                    {/* Produtos com Estoque Crítico Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle size={16} className="text-red-500" />
                                    <h2 className="text-sm font-semibold text-gray-700">Produtos com Estoque Crítico</h2>
                                </div>
                                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Ver todos os produtos →
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">PRODUTO</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">MARCA</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">QTD</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">MÍNIMO</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {alertasEstoque.length > 0 ? (
                                    alertasEstoque.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-sm font-medium text-gray-800">{product.nome}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{product.sku}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{product.marca}</td>
                                            <td className="px-5 py-3 text-right text-sm font-semibold text-red-600">{product.quantidadeAtual} un.</td>
                                            <td className="px-5 py-3 text-right text-sm text-gray-500">{product.quantidadeMinima} un.</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                                            <Package size={32} className="mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">Nenhum produto com estoque crítico</p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Registrar Entrada Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
                        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <Truck size={16} className="text-blue-500" />
                                <h2 className="text-sm font-semibold text-gray-700">Registrar Entrada</h2>
                            </div>
                        </div>

                        <form onSubmit={handleMovementSubmit} className="p-5 space-y-4">
                            {/* Tipo de Movimento */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Tipo de Movimento</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setMovementType('ENTRADA')}
                                        className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                                            movementType === 'ENTRADA'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Entrada (Compra)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMovementType('SAIDA')}
                                        className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                                            movementType === 'SAIDA'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Saída (Venda)
                                    </button>
                                </div>
                            </div>

                            {/* Produto */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Produto *</label>
                                <select
                                    required
                                    value={movementData.productId}
                                    onChange={(e) => setMovementData({ ...movementData, productId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                >
                                    <option value="">Selecionar um produto</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.nome} - {product.sku} (Estoque: {product.quantidadeAtual})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantidade */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={movementData.quantity}
                                    onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            {/* Campos específicos para Entrada */}
                            {movementType === 'ENTRADA' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Código do Lote *</label>
                                        <input
                                            type="text"
                                            required
                                            value={movementData.loteCodigo}
                                            onChange={(e) => setMovementData({ ...movementData, loteCodigo: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            placeholder="LOTE001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Data de Validade</label>
                                        <input
                                            type="date"
                                            value={movementData.validade}
                                            onChange={(e) => setMovementData({ ...movementData, validade: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Nota Fiscal</label>
                                        <input
                                            type="text"
                                            value={movementData.notaFiscal}
                                            onChange={(e) => setMovementData({ ...movementData, notaFiscal: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            placeholder="NF001"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Botões */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMovementData({ productId: '', quantity: 1, loteCodigo: '', validade: '', notaFiscal: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    {movementType === 'ENTRADA' ? 'Confirmar Entrada' : 'Confirmar Saída'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;