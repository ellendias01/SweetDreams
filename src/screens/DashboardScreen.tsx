/**
 * Tela de Dashboard Interno
 * Exibe métricas coletadas pelo sistema de analytics em tempo real
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Trash2, RotateCcw, Download, RefreshCw } from 'lucide-react';
import useRenderTime from '../hooks/useRenderTime';
import AnalyticsService, { AnalyticsMetrics } from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

interface DashboardScreenProps {
  onBack: () => void;
  onVariantToggle: () => void;
  currentVariant: 'A' | 'B';
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBack, onVariantToggle, currentVariant }) => {
  useRenderTime('Dashboard');
  
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const variant = currentVariant;

  useEffect(() => {
    AnalyticsService.logScreenView('Dashboard', variant);
    
    // Carrega métricas iniciais
    setMetrics(AnalyticsService.getMetrics());
    
    // Listener para atualizações em tempo real
    const handleMetricsUpdate = (updatedMetrics: AnalyticsMetrics) => {
      setMetrics(updatedMetrics);
      setUpdateCount(prev => prev + 1);
    };
    
    AnalyticsService.addMetricsListener(handleMetricsUpdate);
    
    return () => {
      AnalyticsService.removeMetricsListener(handleMetricsUpdate);
    };
  }, [variant]);

  const handleClearData = () => {
    AnalyticsService.logButtonClick('Clear Analytics Data', 'Dashboard', variant);
    AnalyticsService.clearEvents();
  };

  const handleToggleVariant = () => {
    AnalyticsService.logButtonClick('Toggle AB Variant', 'Dashboard', variant);
    onVariantToggle();
  };

  const handleResetABTest = () => {
    AnalyticsService.logButtonClick('Reset AB Test', 'Dashboard', variant);
    ABTestingService.resetTest();
    // Força uma nova variante aleatória
    const newVariant = ABTestingService.getUserVariant();
    onVariantToggle();
  };

  const handleExportData = () => {
    AnalyticsService.logButtonClick('Export Data', 'Dashboard', variant);
    if (metrics) {
      const data = JSON.stringify(metrics, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-metrics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando métricas...</p>
      </div>
    );
  }

  // Prepara dados para gráficos
  const screenViewData = Object.entries(metrics.screenViews).map(([key, value]) => ({
    name: key,
    views: value
  }));

  const buttonClickData = Object.entries(metrics.buttonClicks).map(([key, value]) => ({
    name: key.length > 20 ? key.substring(0, 20) + '...' : key,
    clicks: value
  }));

  const renderTimeData = Object.entries(metrics.renderTimes).map(([key, times]) => {
    const avgTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
    return {
      name: key,
      avgTime,
      samples: times.length
    };
  });

  const variantData = [
    { name: 'Variante A', value: metrics.variantDistribution.A, color: '#8884d8' },
    { name: 'Variante B', value: metrics.variantDistribution.B, color: '#82ca9d' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Dashboard Analytics</h1>
            <p className="text-muted-foreground">
              Métricas coletadas em tempo real - {updateCount} atualizações
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Variante {variant}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVariant}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Trocar para {variant === 'A' ? 'B' : 'A'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetABTest}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset A/B
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearData}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Tela</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(metrics.screenViews).reduce((sum, val) => sum + val, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cliques em Botões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(metrics.buttonClicks).reduce((sum, val) => sum + val, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Render</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderTimeData.length > 0 
                ? Math.round(renderTimeData.reduce((sum, item) => sum + item.avgTime, 0) / renderTimeData.length)
                : 0}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="screens" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="screens">Telas</TabsTrigger>
          <TabsTrigger value="buttons">Botões</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="variants">A/B Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="screens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações por Tela</CardTitle>
            </CardHeader>
            <CardContent>
              {screenViewData.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={screenViewData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {screenViewData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.views} visualizações</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma visualização de tela registrada ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cliques em Botões</CardTitle>
            </CardHeader>
            <CardContent>
              {buttonClickData.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={buttonClickData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {buttonClickData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.clicks} cliques</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum clique em botão registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tempo de Renderização por Tela</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTimeData.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={renderTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgTime" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {renderTimeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <span className="text-sm font-medium">{item.name}</span>
                        <p className="text-xs text-muted-foreground">{item.samples} amostras</p>
                      </div>
                      <Badge variant="secondary">{item.avgTime}ms</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma métrica de performance registrada ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="variants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Variantes</CardTitle>
              </CardHeader>
              <CardContent>
                {variantData.some(d => d.value > 0) ? (
                  <div className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={variantData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {variantData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {variantData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <Badge variant="secondary">{item.value} eventos</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum dado de variante registrado ainda.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise do Teste A/B</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Variante Atual</h4>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    Variante {variant}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hipótese</h4>
                  <p className="text-sm text-muted-foreground">
                    A adição da aba "Notificações" (Variante B) aumenta o engajamento do usuário 
                    comparado ao layout original (Variante A).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Métricas Chave</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tempo gasto na aplicação</li>
                    <li>• Número de cliques por sessão</li>
                    <li>• Visualizações de diferentes telas</li>
                    <li>• Interações com notificações (Variante B)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardScreen;