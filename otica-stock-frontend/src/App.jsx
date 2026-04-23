import React, { useState, useEffect } from 'react';
import {
  Package, Plus, TrendingUp, AlertCircle, LayoutDashboard,
  Box, LogOut, User, Bell, Search, Settings, Menu,
  ChevronLeft, ChevronRight, ShoppingCart, Truck, BarChart3
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import api from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      await api.post('/produto', productData);
      await loadProducts();
      setShowProductForm(false);
    } catch (err) {
      alert('Erro ao cadastrar produto');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventario', label: 'Estoque', icon: Box },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'compras', label: 'Compras', icon: Truck },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando sistema...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-20 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className={`p-5 border-b border-gray-200 ${sidebarCollapsed ? 'px-3' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Package className="h-5 w-5 text-white" />
                </div>
                {!sidebarCollapsed && (
                    <div>
                      <h1 className="text-lg font-bold text-gray-800">Ótica Stock</h1>
                      <p className="text-xs text-gray-500">Sistema de Gestão</p>
                    </div>
                )}
              </div>
              <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-gray-400 hover:text-gray-600"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeTab === item.id
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <item.icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="bg-gray-100 rounded-full p-2">
                <User size={16} className="text-gray-600" />
              </div>
              {!sidebarCollapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-400">admin@otica.com</p>
                  </div>
              )}
              {!sidebarCollapsed && <LogOut size={16} className="text-gray-400 cursor-pointer" />}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Bar */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-6 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                      type="text"
                      placeholder="Buscar produtos, clientes..."
                      className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-80 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell size={18} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings size={18} className="text-gray-600" />
                </button>

                <button
                    onClick={() => setShowProductForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Novo Produto</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {activeTab === 'dashboard' && <Dashboard products={products} />}
            {activeTab === 'inventario' && <ProductTable products={products} onRefresh={loadProducts} />}
            {activeTab !== 'dashboard' && activeTab !== 'inventario' && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">Módulo em desenvolvimento</p>
                </div>
            )}
          </main>
        </div>

        {/* Modal */}
        {showProductForm && (
            <ProductForm
                onClose={() => setShowProductForm(false)}
                onSave={handleAddProduct}
            />
        )}
      </div>
  );
}

export default App;