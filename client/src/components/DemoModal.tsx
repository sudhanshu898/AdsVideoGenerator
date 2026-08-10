import React from 'react';
import { XIcon, SparkleIcon } from 'lucide-react';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-3xl bg-slate-950/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="size-5 text-indigo-400" />
                <h3 className="text-xl font-semibold text-white">AdGenix AI Demo Showcase</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Close demo video"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-9/16 sm:aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/10 max-h-[70vh] flex items-center justify-center">
              <video
                src={assets.generatedVideo1}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Footer / Description */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <p>Turn static model & product photos into high-converting AI UGC video ads in seconds.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
              >
                Close Preview
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
