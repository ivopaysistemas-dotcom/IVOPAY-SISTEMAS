
// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Renderiza um componente React, gera um PDF e retorna a URL do Blob.
 * @param component O componente React a ser renderizado.
 * @returns A URL do Blob do PDF gerado.
 */
export const generatePdfBlobUrl = async (component: React.ReactElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Cria um contêiner temporário fora da tela
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);

    // Renderiza o componente
    root.render(component);

    // Atraso para garantir que tudo seja renderizado antes de capturar
    setTimeout(async () => {
      try {
        const elementToCapture = container.firstChild as HTMLElement;
        if (!elementToCapture) {
          throw new Error('O componente não foi renderizado corretamente.');
        }

        const canvas = await html2canvas(elementToCapture, {
          scale: 2, // Aumenta a resolução para melhor qualidade
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        // Gera o PDF como um Blob
        const pdfBlob = pdf.output('blob');
        
        // Cria uma URL para o Blob e a retorna
        const url = URL.createObjectURL(pdfBlob);
        resolve(url);

      } catch (error) {
        reject(error);
      } finally {
        // Limpeza: desmonta o componente e remove o contêiner
        root.unmount();
        document.body.removeChild(container);
      }
    }, 500); // Tempo de espera para renderização
  });
};
