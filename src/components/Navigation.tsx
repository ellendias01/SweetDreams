/**
 * Componente de Navegação Principal
 * Implementa o teste A/B mostrando diferentes abas baseado na variante
 */

import React from 'react';
import { Home, User, Users, Bell } from 'lucide-react';
import ABTestingService from '../services/ABTestingService';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const variant = ABTestingService.getUserVariant();
  
  // Define as abas baseado na variante do teste A/B
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'following', label: 'Seguindo', icon: Users },
    // Aba de notificações só aparece na Variante B
    ...(variant === 'B' ? [{ id: 'notifications', label: 'Notificações', icon: Bell }] : [])
  ];

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex w-full border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary bg-muted/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Indicador visual da variante (só para debug) */}
      <div className="text-xs text-muted-foreground text-center py-1">
        Teste A/B - Variante {variant}
      </div>
    </div>
  );
};

export default Navigation;