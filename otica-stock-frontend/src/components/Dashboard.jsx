import React, { useState, useEffect } from 'react';
import {
    Package, AlertTriangle, Calendar, DollarSign,
    TrendingUp, TrendingDown, Eye, Truck, ArrowUpRight,
    ArrowDownRight, CheckCircle, Clock, Box
} from 'lucide-react';
import api from '../services/api';

const Dashboard = ({ products }) => {
    const [alertasEstoque, setAlertasEstoque] = useState([]);
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
            setMovementData({ productId: '', quantity: 1, loteCodigo: '', validade: '', notaFiscal: '' });
            window.location.reload();
        } catch (err) {
            alert('Erro ao registrar movimento');
        }
    };

    const stats = [
        {
            title: 'Total em Estoque',
            value: totalItems.toLocaleString('pt-BR'),
            subtitle: 'unidades',
            icon: Package,
            change: '+12.5%',
            trend: 'up',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Valor em Estoque',
            value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'valor total',
            icon: DollarSign,
            change: '+8.2%',
            trend: 'up',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Produtos Vencendo',
            value: '0',
            subtitle: 'próximos 30 dias',
            icon: Calendar,
            change: '0 este mês',
            trend: 'down',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Estoque Baixo',
            value: lowStockCount,
            subtitle: 'abaixo do mínimo',
            icon: AlertTriangle,
            change: `+${lowStockCount}`,
            trend: lowStockCount > 0 ? 'up' : 'down',
            bgColor: lowStockCount > 0 ? 'bg-red-50' : 'bg-gray-50',
            iconColor: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600'
        }
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Visão geral do seu negócio</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bgColor} rounded-xl p-3`}>
                                <stat.icon size={22} className={stat.iconColor} />
                            </div>
                            <div className={`flex items-center space-x-1 text-xs font-medium ${
                                stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                        <p className="text-xs text-gray-400 mt-2">{stat.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Products Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle size={18} className="text-red-500" />
                                <h2 className="text-base font-semibold text-gray-800">Produtos com Estoque Crítico</h2>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                                <span>Ver todos os produtos</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PRODUTO</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">MARCA</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">QTD. ATUAL</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">MÍNIMO</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {alertasEstoque.length > 0 ? (
                                    alertasEstoque.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{product.marca}</td>
                                            <td className="px-6 py-4 text-right text-sm font-semibold text-red-600">{product.quantidadeAtual} un.</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-500">{product.quantidadeMinima} un.</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <Package size={40} className="text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">Nenhum produto com estoque crítico</p>
                                            <p className="text-xs text-gray-400 mt-1">Todos os produtos estão dentro do estoque mínimo</p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Register Entry Form */}
                <div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                                <Truck size={18} className="text-blue-600" />
                                <h2 className="text-base font-semibold text-gray-800">Registrar Entrada</h2>
                            </div>
                        </div>

                        <form onSubmit={handleMovementSubmit} className="p-6 space-y-5">
                            {/* Tipo de Movimento */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Tipo de Movimento</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMovementType('ENTRADA')}
                                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
                                            movementType === 'ENTRADA'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Entrada (Compra)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMovementType('SAIDA')}
                                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
                                            movementType === 'SAIDA'
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Saída (Venda)
                                    </button>
                                </div>
                            </div>

                            {/* Produto */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Produto *</label>
                                <select
                                    required
                                    value={movementData.productId}
                                    onChange={(e) => setMovementData({ ...movementData, productId: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                                >
                                    <option value="">Selecionar um produto</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.nome} - {product.sku}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantidade */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantidade *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={movementData.quantity}
                                    onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            {/* Campos específicos para Entrada */}
                            {movementType === 'ENTRADA' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Código do Lote *</label>
                                        <input
                                            type="text"
                                            required
                                            value={movementData.loteCodigo}
                                            onChange={(e) => setMovementData({ ...movementData, loteCodigo: e.target.value })}
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            placeholder="LOTE001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Data de Validade</label>
                                        <input
                                            type="date"
                                            value={movementData.validade}
                                            onChange={(e) => setMovementData({ ...movementData, validade: e.target.value })}
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Nota Fiscal</label>
                                        <input
                                            type="text"
                                            value={movementData.notaFiscal}
                                            onChange={(e) => setMovementData({ ...movementData, notaFiscal: e.target.value })}
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                            placeholder="NF001"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Botões */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setMovementData({ productId: '', quantity: 1, loteCodigo: '', validade: '', notaFiscal: '' })}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
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