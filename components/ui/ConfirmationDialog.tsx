
import React from 'react';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  const colorClass = variant === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-900';
  const iconColor = variant === 'danger' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn border border-slate-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${iconColor}`}>
              ⚠️
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} className="border-slate-300 text-slate-600">
            {cancelText}
          </Button>
          <Button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={`shadow-lg ${colorClass}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
