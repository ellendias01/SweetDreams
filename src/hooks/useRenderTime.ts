/**
 * Hook customizado para medir tempo de renderização
 * Mede o tempo entre o início da renderização e a montagem final do componente
 */

import { useEffect, useRef } from 'react';
import AnalyticsService from '../services/AnalyticsService';
import ABTestingService from '../services/ABTestingService';

export function useRenderTime(screenName: string) {
  const startTimeRef = useRef<number>();
  const hasMeasuredRef = useRef<boolean>(false);

  // Registra o tempo de início no primeiro render
  if (!startTimeRef.current) {
    startTimeRef.current = performance.now();
  }

  useEffect(() => {
    // Só mede uma vez por montagem do componente
    if (!hasMeasuredRef.current && startTimeRef.current) {
      const endTime = performance.now();
      const renderTime = Math.round(endTime - startTimeRef.current);
      const variant = ABTestingService.getUserVariant();
      
      AnalyticsService.logRenderTime(screenName, renderTime, variant);
      hasMeasuredRef.current = true;
    }
  }, [screenName]);

  // Reset quando o componente for desmontado e quando screenName mudar
  useEffect(() => {
    return () => {
      startTimeRef.current = undefined;
      hasMeasuredRef.current = false;
    };
  }, [screenName]);
}

export default useRenderTime;