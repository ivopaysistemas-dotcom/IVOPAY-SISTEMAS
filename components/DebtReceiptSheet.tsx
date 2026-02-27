
// components/DebtReceiptSheet.tsx
import React from 'react';
import { DebtPayment } from '../types';

interface DebtReceiptSheetProps {
  debtPayment: DebtPayment;
  qrCodeDataUrl: string | null;
  pixKey: string | null;
}

const DebtReceiptSheet: React.FC<DebtReceiptSheetProps> = ({ debtPayment, qrCodeDataUrl, pixKey }) => {
    const paymentMethodText = {
        pix: 'PIX',
        dinheiro: 'DINHEiro',
        misto: 'MISTO',
    };
    
    const formatCurrency = (value: number) => (value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="font-bold text-sm">
            <div className="header text-center mb-4">
                <h3 className="font-black text-lg">IVOPAY SISTEMAS</h3>
                <p className="font-bold">COMPROVANTE DE PAGAMENTO DE DÍVIDA</p>
                <p>--------------------------------</p>
            </div>
            
            <div className="space-y-1">
                <p>CLIENTE: {debtPayment.customerName}</p>
                <p>DATA: {new Date(debtPayment.paidAt).toLocaleString('pt-BR')}</p>
                <hr className="border-dashed border-black my-2" />
                
                <div className="receipt-row font-bold text-base pt-2 mt-2">
                    <span className="label">VALOR PAGO:</span>
                    <span className="filler"></span>
                    <span className="value">R$ {formatCurrency(debtPayment.amountPaid)}</span>
                </div>

                <div className="pt-1">
                    <p className="font-bold">PAGAMENTO:</p>
                    {debtPayment.amountPaidDinheiro && debtPayment.amountPaidDinheiro > 0 && (
                        <div className="receipt-row">
                            <span className="label">- Dinheiro:</span>
                            <span className="filler"></span>
                            <span className="value">R$ {formatCurrency(debtPayment.amountPaidDinheiro)}</span>
                        </div>
                    )}
                    {debtPayment.amountPaidPix && debtPayment.amountPaidPix > 0 && (
                        <div className="receipt-row">
                            <span className="label">- PIX:</span>
                            <span className="filler"></span>
                            <span className="value">R$ {formatCurrency(debtPayment.amountPaidPix)}</span>
                        </div>
                    )}
                </div>
            </div>

            {qrCodeDataUrl && pixKey && (
                <div className="text-center mt-4 pt-4 border-t border-dashed border-black">
                    <p className="font-bold">Pague com PIX</p>
                    <img src={qrCodeDataUrl} alt="PIX QR Code" style={{ width: '150px', height: '150px', margin: '8px auto', border: '4px solid black' }} />
                    <p className="text-xs" style={{ wordWrap: 'break-word' }}>Chave: {pixKey}</p>
                </div>
            )}
            
            <div className="text-center mt-4 pt-2 border-t border-dashed border-black">
                <p className="font-bold text-xs">IVOPAY SISTEMAS</p>
                <p className="text-xs">DIVERSAO LEVADO A SERIO.</p>
            </div>
        </div>
    );
};

export default DebtReceiptSheet;
