'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Target, 
  Activity, 
  Crown, 
  Plus, 
  Camera, 
  Play,
  User as UserIcon,
  TrendingUp,
  Clock,
  Zap,
  Bell,
  Upload,
  CheckCircle
} from 'lucide-react';
import { User, Refeicao, Exercicio, HistoricoDiario, EXERCICIOS_MET } from '@/lib/types';
import { 
  calcularIMC, 
  classificarIMC, 
  calcularTMB, 
  calcularMetaCalorica,
  calcularCaloriasExercicio,
  determinarStatus,
  getCorStatus
} from '@/lib/calculations';

export default function NutriTrackAI() {
  const [activeTab, setActiveTab] = useState('resumo');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<User>({
    id: '1',
    nome: 'Usuário',
    email: 'user@example.com',
    idade: 30,
    peso: 70,
    altura: 170,
    sexo: 'masculino',
    nivel_atividade: 'moderado',
    meta_calorias: 2100,
    plano_premium: false
  });

  // Dados iniciais fixos para evitar problemas de hidratação
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);

  const [novaRefeicao, setNovaRefeicao] = useState({ nome: '', calorias: 0 });
  const [novoExercicio, setNovoExercicio] = useState({ tipo: 'Caminhada leve', duracao: 30 });

  // Inicializar dados após montagem do componente
  useEffect(() => {
    setMounted(true);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Fixar horário para evitar diferenças

    setRefeicoes([
      {
        id: '1',
        user_id: '1',
        data: hoje,
        nome: 'Café da manhã',
        calorias: 350,
        imagem_url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
        macros: { carboidratos: 45, proteinas: 15, gorduras: 12 }
      },
      {
        id: '2',
        user_id: '1',
        data: hoje,
        nome: 'Almoço',
        calorias: 650,
        imagem_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        macros: { carboidratos: 60, proteinas: 35, gorduras: 25 }
      },
      {
        id: '3',
        user_id: '1',
        data: hoje,
        nome: 'Lanche',
        calorias: 200,
        imagem_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
        macros: { carboidratos: 25, proteinas: 8, gorduras: 10 }
      }
    ]);

    setExercicios([
      {
        id: '1',
        user_id: '1',
        tipo: 'Corrida',
        duracao_min: 30,
        calorias_gastas: 300,
        data: hoje
      }
    ]);
  }, []);

  // Cálculos em tempo real
  const totalConsumido = refeicoes.reduce((sum, r) => sum + r.calorias, 0);
  const totalGasto = exercicios.reduce((sum, e) => sum + e.calorias_gastas, 0);
  const saldo = totalConsumido - totalGasto;
  const status = determinarStatus(totalConsumido, user.meta_calorias);
  const imc = calcularIMC(user.peso, user.altura);
  const tmb = calcularTMB(user);
  const caloriasRestantes = user.meta_calorias - totalConsumido;

  // Macronutrientes totais
  const macrosTotal = refeicoes.reduce((acc, r) => ({
    carboidratos: acc.carboidratos + r.macros.carboidratos,
    proteinas: acc.proteinas + r.macros.proteinas,
    gorduras: acc.gorduras + r.macros.gorduras
  }), { carboidratos: 0, proteinas: 0, gorduras: 0 });

  // Notificações inteligentes
  useEffect(() => {
    if (!mounted) return;

    const generateNotifications = () => {
      const newNotifications = [];
      
      if (caloriasRestantes > 0 && caloriasRestantes < 500) {
        newNotifications.push(`Você ainda pode consumir ${caloriasRestantes} kcal hoje! 🍎`);
      }
      
      if (totalConsumido > user.meta_calorias) {
        const excesso = totalConsumido - user.meta_calorias;
        newNotifications.push(`Você excedeu sua meta em ${excesso} kcal. Que tal um exercício? 🏃‍♂️`);
      }
      
      if (exercicios.length === 0) {
        newNotifications.push('Não esqueça de registrar seus exercícios hoje! 💪');
      }
      
      const horaAtual = new Date().getHours();
      if (horaAtual >= 18 && refeicoes.filter(r => r.nome.toLowerCase().includes('jantar')).length === 0) {
        newNotifications.push('Hora do jantar! Não esqueça de registrar sua refeição 🍽️');
      }
      
      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [mounted, totalConsumido, user.meta_calorias, exercicios.length, refeicoes, caloriasRestantes]);

  // Login com Google/Apple (simulado)
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setUser({
      ...user,
      nome: provider === 'google' ? 'Usuário Google' : 'Usuário Apple',
      email: provider === 'google' ? 'user@gmail.com' : 'user@icloud.com'
    });
  };

  // Upload de imagem simulado
  const handleImageUpload = async () => {
    setUploadingImage(true);
    
    // Simular análise de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const novaRefeicaoIA: Refeicao = {
      id: Date.now().toString(),
      user_id: user.id,
      data: new Date(),
      nome: 'Prato analisado por IA',
      calorias: Math.floor(Math.random() * 400) + 200,
      imagem_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      macros: {
        carboidratos: Math.floor(Math.random() * 50) + 20,
        proteinas: Math.floor(Math.random() * 30) + 15,
        gorduras: Math.floor(Math.random() * 20) + 10
      }
    };
    
    setRefeicoes([...refeicoes, novaRefeicaoIA]);
    setUploadingImage(false);
  };

  // Verificar pagamento Premium
  const handlePremiumPayment = () => {
    window.open('https://link.infinitepay.io/alerieger/VC1BLTEtSQ-162AtzicvX-10,00', '_blank');
    
    // Simular verificação de pagamento após 3 segundos
    setTimeout(() => {
      setPaymentVerified(true);
      setUser({ ...user, plano_premium: true });
      setTimeout(() => setPaymentVerified(false), 3000);
    }, 3000);
  };

  // Adicionar refeição
  const adicionarRefeicao = () => {
    if (novaRefeicao.nome && novaRefeicao.calorias > 0) {
      const refeicao: Refeicao = {
        id: Date.now().toString(),
        user_id: user.id,
        data: new Date(),
        nome: novaRefeicao.nome,
        calorias: novaRefeicao.calorias,
        imagem_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        macros: {
          carboidratos: Math.floor(novaRefeicao.calorias * 0.5 / 4),
          proteinas: Math.floor(novaRefeicao.calorias * 0.25 / 4),
          gorduras: Math.floor(novaRefeicao.calorias * 0.25 / 9)
        }
      };
      setRefeicoes([...refeicoes, refeicao]);
      setNovaRefeicao({ nome: '', calorias: 0 });
    }
  };

  // Adicionar exercício
  const adicionarExercicio = () => {
    const met = EXERCICIOS_MET[novoExercicio.tipo as keyof typeof EXERCICIOS_MET] || 3.0;
    const calorias = calcularCaloriasExercicio(met, user.peso, novoExercicio.duracao);
    
    const exercicio: Exercicio = {
      id: Date.now().toString(),
      user_id: user.id,
      tipo: novoExercicio.tipo,
      duracao_min: novoExercicio.duracao,
      calorias_gastas: calorias,
      data: new Date()
    };
    
    setExercicios([...exercicios, exercicio]);
  };

  // Atualizar dados do usuário
  const atualizarUsuario = (dados: Partial<User>) => {
    const novoUsuario = { ...user, ...dados };
    const novaTMB = calcularTMB(novoUsuario);
    const novaMeta = calcularMetaCalorica(novaTMB, 'manter');
    
    setUser({
      ...novoUsuario,
      meta_calorias: novaMeta
    });
  };

  // Gerar dados do calendário
  const gerarDadosCalendario = () => {
    const dados = [];
    const hoje = new Date();
    
    for (let i = 0; i < 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      
      const caloriasSimuladas = Math.floor(Math.random() * 1000) + 1500;
      const statusDia = determinarStatus(caloriasSimuladas, user.meta_calorias);
      
      dados.push({
        data: data.toISOString().split('T')[0],
        calorias: caloriasSimuladas,
        status: statusDia
      });
    }
    
    return dados.reverse();
  };

  // Não renderizar até que o componente esteja montado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando NutriTrack AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">NutriTrack AI</h1>
              {user.plano_premium && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full">
                  Premium 💎
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Notificações</h3>
                    {notifications.length > 0 ? (
                      <div className="space-y-2">
                        {notifications.map((notif, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg text-sm text-gray-700">
                            {notif}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhuma notificação no momento</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Login */}
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Entrar
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <UserIcon className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-700">{user.nome}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 mx-4">
            <h2 className="text-xl font-bold text-center mb-6">Entrar no NutriTrack AI</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl py-3 hover:border-gray-300 transition-colors"
              >
                <div className="w-5 h-5 bg-red-500 rounded"></div>
                <span className="font-medium">Continuar com Google</span>
              </button>
              
              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center justify-center space-x-3 bg-black text-white rounded-xl py-3 hover:bg-gray-800 transition-colors"
              >
                <div className="w-5 h-5 bg-white rounded"></div>
                <span className="font-medium">Continuar com Apple</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Feedback de Pagamento */}
      {paymentVerified && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>✅ Pagamento confirmado! Premium ativado</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-md mx-auto pb-20">
        {/* Aba Resumo Diário */}
        {activeTab === 'resumo' && (
          <div className="p-4 space-y-6">
            {/* Placar de Calorias */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {totalConsumido.toLocaleString()} kcal
                </h2>
                <p className="text-gray-600">de {user.meta_calorias.toLocaleString()} kcal</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getCorStatus(status)}`}
                      style={{ width: `${Math.min((totalConsumido / user.meta_calorias) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {caloriasRestantes > 0 
                    ? `Restam ${caloriasRestantes} kcal` 
                    : `Excedeu em ${Math.abs(caloriasRestantes)} kcal`
                  }
                </p>
              </div>

              {/* Gráfico de Macros */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">{macrosTotal.carboidratos}g</span>
                  </div>
                  <p className="text-xs text-gray-600">Carboidratos</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 font-bold text-sm">{macrosTotal.proteinas}g</span>
                  </div>
                  <p className="text-xs text-gray-600">Proteínas</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-600 font-bold text-sm">{macrosTotal.gorduras}g</span>
                  </div>
                  <p className="text-xs text-gray-600">Gorduras</p>
                </div>
              </div>
            </div>

            {/* Upload de Imagem */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <button
                onClick={handleImageUpload}
                disabled={uploadingImage || !user.plano_premium}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium transition-colors ${
                  user.plano_premium
                    ? uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analisando imagem...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span>📸 Enviar refeição</span>
                    {!user.plano_premium && <Crown className="w-4 h-4" />}
                  </>
                )}
              </button>
              {!user.plano_premium && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Recurso disponível apenas no Premium
                </p>
              )}
            </div>

            {/* Lista de Refeições */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Refeições de Hoje</h3>
              <div className="space-y-3">
                {refeicoes.map((refeicao) => (
                  <div key={refeicao.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <img 
                      src={refeicao.imagem_url} 
                      alt={refeicao.nome}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{refeicao.nome}</p>
                      <p className="text-sm text-gray-600">{refeicao.calorias} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adicionar Refeição */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Nova Refeição</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome da refeição"
                  value={novaRefeicao.nome}
                  onChange={(e) => setNovaRefeicao({...novaRefeicao, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Calorias"
                  value={novaRefeicao.calorias || ''}
                  onChange={(e) => setNovaRefeicao({...novaRefeicao, calorias: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={adicionarRefeicao}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Adicionar Refeição
                </button>
              </div>
            </div>

            {/* Botão Premium */}
            {!user.plano_premium && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
                <Crown className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Ativar Premium</h3>
                <p className="text-sm opacity-90 mb-4">
                  Análise de fotos por IA, relatórios detalhados e muito mais!
                </p>
                <button
                  onClick={handlePremiumPayment}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Ativar plano premium 💎
                </button>
              </div>
            )}
          </div>
        )}

        {/* Aba Histórico Mensal */}
        {activeTab === 'historico' && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Histórico Mensal</h2>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                  <div key={dia} className="text-center text-xs font-medium text-gray-500 py-2">
                    {dia}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {gerarDadosCalendario().map((dia, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-all hover:scale-105 ${
                      dia.status === 'dentro' ? 'bg-green-100 text-green-800' :
                      dia.status === 'abaixo' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    <span className="font-bold">{new Date(dia.data).getDate()}</span>
                    <span className="text-xs">{dia.calorias}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>Dentro da meta</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>Abaixo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>Acima</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Metas & Cálculos */}
        {activeTab === 'metas' && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Seus Dados</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                  <input
                    type="number"
                    value={user.idade}
                    onChange={(e) => atualizarUsuario({ idade: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    value={user.peso}
                    onChange={(e) => atualizarUsuario({ peso: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={user.altura}
                    onChange={(e) => atualizarUsuario({ altura: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                  <select
                    value={user.sexo}
                    onChange={(e) => atualizarUsuario({ sexo: e.target.value as 'masculino' | 'feminino' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Atividade</label>
                <select
                  value={user.nivel_atividade}
                  onChange={(e) => atualizarUsuario({ nivel_atividade: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="intenso">Intenso</option>
                </select>
              </div>
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Seus Resultados</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{imc.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">IMC</p>
                  <p className="text-xs text-gray-500">{classificarIMC(imc)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{Math.round(tmb)}</p>
                  <p className="text-sm text-gray-600">TMB</p>
                  <p className="text-xs text-gray-500">kcal/dia</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">{user.meta_calorias}</p>
                <p className="text-sm text-gray-600">Meta Diária</p>
                <p className="text-xs text-gray-500">Para manter peso</p>
              </div>
            </div>

            {/* Saldo Diário */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Saldo de Hoje</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consumido</span>
                  <span className="font-bold text-green-600">+{totalConsumido} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gasto</span>
                  <span className="font-bold text-red-600">-{totalGasto} kcal</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Saldo</span>
                  <span className={`font-bold ${saldo > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {saldo > 0 ? '+' : ''}{saldo} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Exercícios & Hábitos */}
        {activeTab === 'exercicios' && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Exercícios de Hoje</h2>
              
              {exercicios.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {exercicios.map((exercicio) => (
                    <div key={exercicio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{exercicio.tipo}</p>
                          <p className="text-sm text-gray-600">{exercicio.duracao_min} min</p>
                        </div>
                      </div>
                      <span className="font-bold text-red-600">-{exercicio.calorias_gastas} kcal</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum exercício registrado hoje</p>
                </div>
              )}
              
              {/* Adicionar Exercício */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Exercício</label>
                  <select
                    value={novoExercicio.tipo}
                    onChange={(e) => setNovoExercicio({...novoExercicio, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {Object.keys(EXERCICIOS_MET).map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração: {novoExercicio.duracao} minutos
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={novoExercicio.duracao}
                    onChange={(e) => setNovoExercicio({...novoExercicio, duracao: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>120 min</span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Calorias estimadas:</p>
                  <p className="text-xl font-bold text-red-600">
                    -{Math.round(calcularCaloriasExercicio(
                      EXERCICIOS_MET[novoExercicio.tipo as keyof typeof EXERCICIOS_MET] || 3.0,
                      user.peso,
                      novoExercicio.duracao
                    ))} kcal
                  </p>
                </div>
                
                <button
                  onClick={adicionarExercicio}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                >
                  Adicionar Exercício
                </button>
              </div>
            </div>

            {/* Habit Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Hábitos da Semana</h3>
              
              <div className="grid grid-cols-7 gap-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">{dia}</p>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      Math.random() > 0.3 ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {Math.random() > 0.3 && <Activity className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Plano Premium */}
        {activeTab === 'premium' && (
          <div className="p-4 space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">NutriTrack Premium</h2>
              <p className="opacity-90 mb-6">
                Desbloqueie todo o potencial do seu acompanhamento nutricional
              </p>
              
              {user.plano_premium ? (
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Premium Ativo! 💎</p>
                  <p className="text-sm opacity-90">Aproveite todos os recursos</p>
                </div>
              ) : (
                <button
                  onClick={handlePremiumPayment}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Ativar Premium por R$10,00/mês
                </button>
              )}
            </div>

            {/* Benefícios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Benefícios Premium</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Análise automática de alimentos via IA</h4>
                    <p className="text-sm text-gray-600">Tire uma foto e nossa IA identifica automaticamente as calorias e macronutrientes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Relatórios semanais detalhados</h4>
                    <p className="text-sm text-gray-600">Receba insights personalizados sobre seu progresso e sugestões de melhoria</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Sincronização com Google Fit</h4>
                    <p className="text-sm text-gray-600">Conecte com seus dispositivos e apps de fitness favoritos</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Notificações inteligentes</h4>
                    <p className="text-sm text-gray-600">Lembretes personalizados baseados nos seus hábitos e metas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Upload className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Exportação de dados</h4>
                    <p className="text-sm text-gray-600">Exporte seus dados em PDF ou CSV para compartilhar com profissionais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'resumo', icon: Home, label: 'Resumo' },
              { id: 'historico', icon: Calendar, label: 'Histórico' },
              { id: 'metas', icon: Target, label: 'Metas' },
              { id: 'exercicios', icon: Activity, label: 'Exercícios' },
              { id: 'premium', icon: Crown, label: 'Premium' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}