/**
 * Serviço de Analytics
 * Coleta métricas de performance e engajamento
 * Simula integração com Firebase Analytics, Mixpanel, etc.
 */

import { ABVariant } from './ABTestingService';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'screen_view' | 'button_click' | 'render_time';
  screenName?: string;
  buttonName?: string;
  variant: ABVariant;
  renderTime?: number;
}

export interface AnalyticsMetrics {
  screenViews: { [key: string]: number };
  buttonClicks: { [key: string]: number };
  renderTimes: { [key: string]: number[] };
  totalEvents: number;
  variantDistribution: { A: number; B: number };
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private listeners: ((metrics: AnalyticsMetrics) => void)[] = [];

  private constructor() {
    this.loadEventsFromStorage();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Registra visualização de tela
   */
  public logScreenView(screenName: string, variant: ABVariant): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'screen_view',
      screenName,
      variant
    };

    this.addEvent(event);
    console.log(`[Analytics] Tela visualizada: ${screenName} (Variante ${variant})`);
  }

  /**
   * Registra clique em botão
   */
  public logButtonClick(buttonName: string, screenName: string, variant: ABVariant): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'button_click',
      screenName,
      buttonName,
      variant
    };

    this.addEvent(event);
    console.log(`[Analytics] Botão clicado: ${buttonName} em ${screenName} (Variante ${variant})`);
  }

  /**
   * Registra tempo de renderização
   */
  public logRenderTime(screenName: string, renderTime: number, variant: ABVariant): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'render_time',
      screenName,
      renderTime,
      variant
    };

    this.addEvent(event);
    console.log(`[Analytics] Tempo de renderização: ${screenName} = ${renderTime}ms (Variante ${variant})`);
  }

  /**
   * Adiciona evento e notifica listeners
   */
  private addEvent(event: AnalyticsEvent): void {
    this.events.push(event);
    this.saveEventsToStorage();
    this.notifyListeners();
  }

  /**
   * Calcula métricas agregadas
   */
  public getMetrics(): AnalyticsMetrics {
    const metrics: AnalyticsMetrics = {
      screenViews: {},
      buttonClicks: {},
      renderTimes: {},
      totalEvents: this.events.length,
      variantDistribution: { A: 0, B: 0 }
    };

    this.events.forEach(event => {
      // Contagem de variantes
      metrics.variantDistribution[event.variant]++;

      switch (event.type) {
        case 'screen_view':
          if (event.screenName) {
            const key = `${event.screenName} (${event.variant})`;
            metrics.screenViews[key] = (metrics.screenViews[key] || 0) + 1;
          }
          break;

        case 'button_click':
          if (event.buttonName && event.screenName) {
            const key = `${event.buttonName} em ${event.screenName} (${event.variant})`;
            metrics.buttonClicks[key] = (metrics.buttonClicks[key] || 0) + 1;
          }
          break;

        case 'render_time':
          if (event.screenName && event.renderTime) {
            const key = `${event.screenName} (${event.variant})`;
            if (!metrics.renderTimes[key]) {
              metrics.renderTimes[key] = [];
            }
            metrics.renderTimes[key].push(event.renderTime);
          }
          break;
      }
    });

    return metrics;
  }

  /**
   * Adiciona listener para mudanças nas métricas
   */
  public addMetricsListener(listener: (metrics: AnalyticsMetrics) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   */
  public removeMetricsListener(listener: (metrics: AnalyticsMetrics) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach(listener => listener(metrics));
  }

  /**
   * Gera ID único para eventos
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Salva eventos no localStorage (simulação)
   */
  private saveEventsToStorage(): void {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('[Analytics] Erro ao salvar eventos:', error);
    }
  }

  /**
   * Carrega eventos do localStorage (simulação)
   */
  private loadEventsFromStorage(): void {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[Analytics] Erro ao carregar eventos:', error);
      this.events = [];
    }
  }

  /**
   * Limpa todos os eventos (útil para testes)
   */
  public clearEvents(): void {
    this.events = [];
    this.saveEventsToStorage();
    this.notifyListeners();
    console.log('[Analytics] Eventos limpos');
  }

  /**
   * Calcula tempo médio de renderização
   */
  public getAverageRenderTime(screenName: string, variant?: ABVariant): number {
    const renderEvents = this.events.filter(event => 
      event.type === 'render_time' && 
      event.screenName === screenName &&
      (variant === undefined || event.variant === variant)
    );

    if (renderEvents.length === 0) return 0;

    const total = renderEvents.reduce((sum, event) => sum + (event.renderTime || 0), 0);
    return Math.round(total / renderEvents.length);
  }
}

export default AnalyticsService.getInstance();