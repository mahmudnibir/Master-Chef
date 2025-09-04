import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md mx-4 transform transition-all animate-fade-in-up">
        <h3 id="modal-title" className="text-2xl font-bold text-emerald-800 font-serif">{title}</h3>
        <div className="mt-4 text-stone-600">
          {message}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Add Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
