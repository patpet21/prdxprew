
import { useState, useCallback } from "react";

export default function useUndoRedo<T>(initialState: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialState);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [past, present, future, canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setFuture(newFuture);
    setPresent(next);
  }, [past, present, future, canRedo]);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setPast((prevPast) => [...prevPast, present]);
    setPresent((curr) => {
      const val = newState instanceof Function ? newState(curr) : newState;
      return val;
    });
    setFuture([]);
  }, [present]);

  // Specific helper to update state without pushing to history (useful for streaming chunks)
  const updateCurrent = useCallback((newState: T | ((prev: T) => T)) => {
     setPresent((curr) => {
      const val = newState instanceof Function ? newState(curr) : newState;
      return val;
    });
  }, []);

  return { 
    state: present, 
    setState, 
    updateCurrent, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    pastHistory: past 
  };
}
