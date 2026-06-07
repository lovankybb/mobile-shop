import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState(null);

  const showPopup = useCallback(({ type, title, message, onConfirm, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
    setPopup({ type, title, message, onConfirm, confirmText, cancelText });
  }, []);

  const closePopup = useCallback(() => {
    setPopup(null);
  }, []);

  const handleConfirm = () => {
    if (popup.onConfirm) {
      popup.onConfirm();
    }
    closePopup();
  };

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      <AnimatePresence>
        {popup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white border border-gray-100 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="flex justify-center mb-5">
                  {popup.type === 'success' && (
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                  )}
                  {popup.type === 'error' && (
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                      <AlertCircle size={32} className="text-red-500" />
                    </div>
                  )}
                  {popup.type === 'confirm' && (
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <HelpCircle size={32} className="text-blue-500" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {popup.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {popup.message}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                {popup.type === 'confirm' ? (
                  <>
                    <button 
                      onClick={closePopup}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {popup.cancelText}
                    </button>
                    <button 
                      onClick={handleConfirm}
                      className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                    >
                      {popup.confirmText}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={closePopup}
                    className="w-full px-5 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PopupContext.Provider>
  );
};
