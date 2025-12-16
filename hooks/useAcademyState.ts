
import { useState, useEffect, useCallback } from 'react';
import { AcademyState, AcademyModuleState } from '../types';
import { storageUtils } from '../utils/storageUtils';

const STORAGE_KEY = 'pdx_academy_state';

const INITIAL_ACADEMY_STATE: AcademyState = {
  modules: {},
  meta: {
    totalProgress: 0,
    currentModuleId: 'onboarding_theory',
    startDate: new Date().toISOString(),
    certificateIssued: false
  }
};

export const useAcademyState = () => {
  // Use storageUtils to safely load initial state
  const [state, setState] = useState<AcademyState>(() => 
    storageUtils.load<AcademyState>(STORAGE_KEY, INITIAL_ACADEMY_STATE)
  );

  // Persist state changes
  useEffect(() => {
    storageUtils.save(STORAGE_KEY, state);
  }, [state]);

  const updateModule = useCallback((moduleId: string, updates: Partial<AcademyModuleState>) => {
    setState(prev => {
      const currentModule = prev.modules[moduleId] || {
        id: moduleId,
        completed: false,
        lastUpdated: new Date().toISOString()
      };
      
      const updatedModule: AcademyModuleState = { ...currentModule, ...updates, lastUpdated: new Date().toISOString() };
      const nextModules = { ...prev.modules, [moduleId]: updatedModule };
      
      // Calculate global progress
      const completedCount = Object.values(nextModules).filter((m: AcademyModuleState) => m.completed).length;
      const totalProgress = Math.round((completedCount / 12) * 100); // Assuming 12 modules

      return {
        ...prev,
        modules: nextModules,
        meta: { ...prev.meta, totalProgress }
      };
    });
  }, []);

  const getModuleData = useCallback((moduleId: string): AcademyModuleState | undefined => {
    return state.modules[moduleId];
  }, [state]);

  const completeModule = useCallback((moduleId: string) => {
    updateModule(moduleId, { completed: true });
  }, [updateModule]);

  const resetAcademy = useCallback(() => {
      setState(INITIAL_ACADEMY_STATE);
      storageUtils.remove(STORAGE_KEY);
  }, []);

  return {
    state,
    updateModule,
    getModuleData,
    completeModule,
    resetAcademy
  };
};
