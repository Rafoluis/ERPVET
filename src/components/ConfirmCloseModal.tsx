// ConfirmCloseModal Component
import { createPortal } from "react-dom";
import React from "react";

interface ConfirmCloseModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({ onConfirm, onCancel }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-sm z-60">
        <p className="text-center text-lg font-medium">¿Estás seguro de que deseas cerrar el formulario?</p>
        <div className="mt-6 flex justify-center space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-white rounded bg-backbuttondefault hover:bg-backbuttonhover transition">Aceptar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmCloseModal;