/**
 * Serviço de Teste A/B
 * Determina aleatoriamente qual variante do teste o usuário vai ver
 * 
 * Variante A (Controle): Home, Perfil, Seguindo
 * Variante B (Teste): Home, Perfil, Seguindo, Notificações
 */

export type ABVariant = 'A' | 'B';

class ABTestingService {
  private static instance: ABTestingService;
  private userVariant: ABVariant | null = null;

  private constructor() {}

  public static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  /**
   * Determina a variante do usuário na primeira execução
   * Armazena a decisão para manter consistência durante a sessão
   */
  public getUserVariant(): ABVariant {
    if (this.userVariant === null) {
      // Gera aleatoriamente A ou B com 50% de chance cada
      this.userVariant = Math.random() < 0.5 ? 'A' : 'B';
      
      console.log(`[A/B Test] Usuário atribuído à Variante ${this.userVariant}`);
      
      // Em uma implementação real, seria salvo no AsyncStorage ou localStorage
      localStorage.setItem('ab_test_variant', this.userVariant);
    }
    
    return this.userVariant;
  }

  /**
   * Recupera a variante do armazenamento local (simulação)
   */
  public loadVariantFromStorage(): ABVariant | null {
    const stored = localStorage.getItem('ab_test_variant');
    if (stored && (stored === 'A' || stored === 'B')) {
      this.userVariant = stored as ABVariant;
      return this.userVariant;
    }
    return null;
  }

  /**
   * Força uma variante específica (útil para testes)
   */
  public setVariant(variant: ABVariant): void {
    this.userVariant = variant;
    localStorage.setItem('ab_test_variant', variant);
    console.log(`[A/B Test] Variante forçada para ${variant}`);
  }

  /**
   * Reset do teste (útil para testes)
   */
  public resetTest(): void {
    this.userVariant = null;
    localStorage.removeItem('ab_test_variant');
    console.log('[A/B Test] Teste resetado');
  }
}

export default ABTestingService.getInstance();