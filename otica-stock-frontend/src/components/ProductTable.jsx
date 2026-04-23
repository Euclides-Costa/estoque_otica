import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Edit, Download, Printer, Package } from 'lucide-react';

const ProductTable = ({ products, onRefresh }) => {
    const [filters, setFilters] = useState({
        sku: '',
        marca: '',
        tipo: ''
    });
    const [sortField, setSortField] = useState('nome');
    const [sortDirection, setSortDirection] = useState('asc');

    const tipos = [...new Set(products.map(p => p.tipo || 'ARMACAO'))];

    const filteredProducts = products.filter(product => {
        return (
            (filters.sku === '' || product.sku?.toLowerCase().includes(filters.sku.toLowerCase())) &&
            (filters.marca === '' || product.marca?.toLowerCase().includes(filters.marca.toLowerCase())) &&
            (filters.tipo === '' || product.tipo === filters.tipo)
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStockStatus = (quantity, minQuantity) => {
        if (quantity <= minQuantity) return { label: 'Crítico', color: 'red', bg: 'bg-red-100', text: 'text-red-700' };
        if (quantity <= minQuantity * 2) return { label: 'Baixo', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' };
        return { label: 'Normal', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronDown size={14} className="text-gray-400" />;
        return sortDirection === 'asc' ?
            <ChevronUp size={14} className="text-blue-600" /> :
            <ChevronDown size={14} className="text-blue-600" />;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Estoque de Produtos</h1>
                    <p className="text-sm text-gray-500 mt-1">Total de registros: {filteredProducts.length}</p>
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                        <Download size={16} />
                        <span className="text-sm">Exportar</span>
                    </button>
                    <button className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                        <Printer size={16} />
                        <span className="text-sm">Imprimir</span>
                    </button>
                    <button
                        onClick={onRefresh}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Atualizar
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={filters.sku}
                                onChange={(e) => setFilters({ ...filters, sku: e.target.value })}
                                className="pl-9 w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                                placeholder="Buscar por SKU..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Marca</label>
                        <input
                            type="text"
                            value={filters.marca}
                            onChange={(e) => setFilters({ ...filters, marca: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                            placeholder="Filtrar por marca..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            value={filters.tipo}
                            onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                        >
                            <option value="">Todos</option>
                            {tipos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo === 'ARMACAO' ? 'Armação' : 'Lente'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ sku: '', marca: '', tipo: '' })}
                            className="w-full px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th onClick={() => handleSort('sku')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>SKU</span>
                                    <SortIcon field="sku" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('nome')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>Produto</span>
                                    <SortIcon field="nome" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('marca')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>Marca</span>
                                    <SortIcon field="marca" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Especificações
                            </th>
                            <th onClick={() => handleSort('quantidadeAtual')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>Quantidade</span>
                                    <SortIcon field="quantidadeAtual" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('precoVenda')} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>Valor Unit.</span>
                                    <SortIcon field="precoVenda" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Subtotal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {sortedProducts.map((product) => {
                            const status = getStockStatus(product.quantidadeAtual, product.quantidadeMinima);
                            const subtotal = (product.quantidadeAtual || 0) * (product.precoVenda || 0);
                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {product.sku}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {product.nome}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {product.marca}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {product.tipo === 'LENTE' ? (
                                            <div className="text-xs">
                                                <div>Grau: {product.grauEsferico || '-'}</div>
                                                <div>Cil: {product.grauCilindrico || '-'} | Eixo: {product.eixo || '-'}</div>
                                            </div>
                                        ) : (
                                            <span className="text-xs">Armação</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        {product.quantidadeAtual} un.
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        R$ {(product.precoVenda || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        R$ {subtotal.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {sortedProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhum produto encontrado</p>
                        <button
                            onClick={() => setFilters({ sku: '', marca: '', tipo: '' })}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTable;