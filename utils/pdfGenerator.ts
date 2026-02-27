
// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Renderiza um componente React, gera um PDF e retorna a URL do Blob.
 * Usa uma abordagem mais robusta com requestAnimationFrame para aguardar a renderização.
 * @param component O componente React a ser renderizado.
 * @returns A URL do Blob do PDF gerado.
 */
export const generatePdfBlobUrl = async (component: React.ReactElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Cria um contêiner temporário fora da tela
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px'; // Mantém fora da tela
    container.style.left = '-9999px';
    container.style.width = '800px'; // Define uma largura fixa para consistência
    document.body.appendChild(container);

    const root = createRoot(container);

    // Função para capturar e gerar o PDF
    const captureAndGenerate = async () => {
      try {
        const elementToCapture = container.firstChild as HTMLElement;
        if (!elementToCapture) {
          throw new Error('O componente React não foi renderizado no contêiner.');
        }

        const canvas = await html2canvas(elementToCapture, {
          scale: 2, // Aumenta a resolução para melhor qualidade
          useCORS: true, // Permite carregar imagens de outras origens
          logging: false, // Desativa o logging do html2canvas no console
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          // Usa o tamanho do canvas para definir o formato do PDF
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        resolve(url);

      } catch (error) {
        console.error("Erro durante a geração do PDF:", error);
        reject(error);
      } finally {
        // Limpeza: desmonta o componente e remove o contêiner
        root.unmount();
        document.body.removeChild(container);
      }
    };

    // Renderiza o componente e usa requestAnimationFrame para aguardar o próximo "paint"
    root.render(component);
    requestAnimationFrame(() => {
        // Adiciona um segundo rAF para garantir que o DOM foi atualizado e renderizado
        requestAnimationFrame(captureAndGenerate);
    });
  });
};
