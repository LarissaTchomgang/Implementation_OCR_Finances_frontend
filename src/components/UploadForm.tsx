// src/components/UploadForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/extract-form", formData);
      const extractedData = response.data;

      // Stocke les données dans localStorage (ou context)
      localStorage.setItem("extractedData", JSON.stringify(extractedData));

      // Navigue vers la page de review
      navigate("/review");
    } catch (error) {
      console.error("Erreur lors de l'extraction :", error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Extraire et pré-remplir
      </button>
    </div>
  );
};

export default UploadForm;
