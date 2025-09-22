/**
 * Aplicativo Principal - Twitter Clone com A/B Testing
 * 
 * Este aplicativo simula o Twitter com foco em arquitetura robusta
 * para testes A/B e coleta de métricas de performance e engajamento.
 * 
 * Funcionalidades:
 * - Sistema de navegação com teste A/B (com/sem aba Notificações)
 * - Coleta de métricas de performance e engajamento
 * - Dashboard interno para visualizar dados em tempo real
 * - CRUD de posts com interações (like, retweet, reply)
 */

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import Navigation from './src/components/Navigation';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ABTestingService from './src/services/ABTestingService';

type Screen = 'home' | 'profile' | 'following' | 'notifications' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    // Carrega variante salva ou determina nova variante
    const savedVariant = ABTestingService.loadVariantFromStorage();
    if (savedVariant) {
      setVariant(savedVariant);
    } else {
      const newVariant = ABTestingService.getUserVariant();
      setVariant(newVariant);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as Screen);
  };

  const handleShowDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackFromDashboard = () => {
    setCurrentScreen('home');
  };

  const handleVariantToggle = () => {
    const newVariant = variant === 'A' ? 'B' : 'A';
    ABTestingService.setVariant(newVariant);
    setVariant(newVariant);
    // Força mudança de tela para home para mostrar a mudança
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onShowDashboard={handleShowDashboard} onVariantToggle={handleVariantToggle} currentVariant={variant} />;
      case 'profile':
        return <ProfileScreen />;
      case 'following':
        return <FollowingScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'dashboard':
        return <DashboardScreen onBack={handleBackFromDashboard} onVariantToggle={handleVariantToggle} currentVariant={variant} />;
      default:
        return <HomeScreen onShowDashboard={handleShowDashboard} onVariantToggle={handleVariantToggle} currentVariant={variant} />;
    }
  };

  // Se estiver no dashboard, não mostra a navegação principal
  if (currentScreen === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <DashboardScreen onBack={handleBackFromDashboard} onVariantToggle={handleVariantToggle} currentVariant={variant} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navegação Principal com Teste A/B */}
      <Navigation 
        activeTab={currentScreen} 
        onTabChange={handleTabChange}
      />
      
      {/* Conteúdo Principal */}
      <main className="pb-4">
        {renderScreen()}
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}