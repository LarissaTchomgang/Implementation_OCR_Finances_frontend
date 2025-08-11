// src/api/ocr.ts
import axios from 'axios';


const API_URL ='https://implementation-ocr-finances-backend.onrender.com/'; //'http://localhost:8000/api'; // Assure-toi que ton backend tourne bien à ce port


// ✅ Upload et extraction automatique via OCR
export const uploadAndExtract = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/extract`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// ✅ Envoi des données corrigées pour export Excel
export const generateExcelFromData = async (formData: any) => {
  const response = await axios.post(`${API_URL}/export-excel-from-json`, formData);
  return response.data;
};
