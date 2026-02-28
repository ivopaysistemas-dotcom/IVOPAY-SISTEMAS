// components/QrScannerModal.tsx
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Customer, Equipment } from '../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (customer: Customer, equipment: Equipment) => void;
  showNotification: (message: string, type: 'success' | 'error') => void;
  customers: Customer[];
}

const qrScannerId = "qr-reader";

const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess, showNotification, customers }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrScannerId);
      }
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop().catch(err => console.error("Failed to stop QR scanner:", err));

          const customer = customers.find(c => c.equipment?.some(e => e.id === decodedText));
          const equipment = customer?.equipment.find(e => e.id === decodedText);

          if (customer && equipment) {
            onScanSuccess(customer, equipment);
          } else {
            showNotification('Equipamento não encontrado. Verifique se o QR code é válido ou tente novamente.', 'error');
            onClose();
          }
        }
      };

      const qrCodeErrorCallback = (errorMessage: string) => {
        // This callback can be ignored to avoid spamming console
      };

      Html5Qrcode.getCameras().then(cameras => {
          if (cameras && cameras.length) {
              const cameraId = cameras.find(c => c.label.toLowerCase().includes('back'))?.id || cameras[0].id;
              scannerRef.current?.start(
                  cameraId,
                  config,
                  qrCodeSuccessCallback,
                  qrCodeErrorCallback
              ).catch(err => {
                  showNotification('Falha ao iniciar a câmera.', 'error');
                  console.error('Unable to start scanning.', err);
                  onClose();
              });
          } else {
              showNotification('Nenhuma câmera encontrada.', 'error');
              onClose();
          }
      }).catch(err => {
          showNotification('Erro ao acessar câmeras. Verifique as permissões.', 'error');
          console.error(err);
          onClose();
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Error stopping the scanner on cleanup: ", err);
        });
      }
    };
  }, [isOpen, onScanSuccess, onClose, showNotification, customers]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
    >
      <div id={qrScannerId} className="w-full max-w-md h-auto aspect-square rounded-lg overflow-hidden border-2 border-lime-500 bg-gray-800"></div>
      <p className="text-white mt-4 text-center">Aponte a câmera para o QR Code do equipamento</p>
      <button 
        onClick={onClose} 
        className="mt-6 bg-slate-600 text-white font-bold py-2 px-8 rounded-md hover:bg-slate-500"
      >
        Cancelar
      </button>
    </div>
  );
};

export default QrScannerModal;
