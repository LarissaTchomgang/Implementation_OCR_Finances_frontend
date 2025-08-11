import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAndExtract, generateExcelFromData } from "../api/ocr";
import BankForm from "../components/BankForm";
import TransactionTable from "../components/TransactionTable";
import { Button } from "../components/ui/Button";

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const response = await uploadAndExtract(file);
      setFormData(response.extracted_data);
      localStorage.setItem("formData", JSON.stringify(response.extracted_data));
    } catch (error) {
      alert("Une erreur est survenue lors de l'extraction.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!formData) return;
    const res = await generateExcelFromData(formData);
    alert("Fichier Excel généré : " + res.excel_file);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTransactionChange = (index: number, field: string, value: string) => {
    const updated = [...formData.transactions];
    updated[index][field] = value;
    setFormData({ ...formData, transactions: updated });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Extraction Automatique de Relevé Bancaire</h1>

      {/* Texte explicatif (visible tant qu'aucun fichier n'est sélectionné) */}
      {!file && (
        <div style={styles.introBox}>
          <p>
            Cette application vous permet d’extraire automatiquement les informations clés d’un relevé bancaire
            (nom de la banque, titulaire, numéro de compte, transactions, etc.) à partir d’une image. <br />
            <br />
            📎 Pour commencer, choisissez un fichier d’image (JPG, PNG). Vous verrez ensuite un aperçu et un formulaire
            pré-rempli que vous pourrez valider ou corriger avant de générer un fichier Excel.
          </p>
        </div>
      )}

      {/* Zone d’upload visible même sans fichier */}
      {!imagePreview && (
        <div style={styles.uploadPlaceholder}>
          <label style={styles.fileUploadLabel}>
            📁 Choisir un fichier
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            
          </label>
        </div>
      )}

      {/* Affichage de l’aperçu une fois le fichier choisi */}
      {imagePreview && (
        <div style={styles.previewContainer}>
          <img src={imagePreview} alt="Aperçu" style={styles.imagePreview} />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button onClick={handleUpload}>🔍 Lancer l'extraction</Button>
          </div>
        </div>
      )}

      {loading && <p style={styles.spinner}>⏳ Extraction en cours...</p>}

      {/* Résultat affiché si disponible */}
      {formData && (
        <div style={styles.formContainer}>
          <BankForm data={formData} onChange={handleChange} readOnly={true} />
          <TransactionTable
            transactions={formData.transactions}
            onChange={handleTransactionChange}
            readOnly={true}
          />
          <div style={styles.buttonGroup}>
            <Button onClick={handleValidate}>✅ Valider et Générer Excel</Button>
            <Button onClick={() => navigate("/review")}>✏️ Modifier le formulaire</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

// 🎨 STYLES INLINE — SAPHIR Edition
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "28px",
    color: "#0057A0", // Bleu SAPHIR
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  introBox: {
    backgroundColor: "#FFF8DC", // Jaune pâle
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    border: "1px solid #FFD700",
    color: "#333",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  fileUploadLabel: {
    display: "inline-block",
    backgroundColor: "#FFD700", // Jaune SAPHIR
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: "1rem",
  },
  uploadPlaceholder: {
    textAlign: "center",
    marginTop: "3rem",
    padding: "3rem",
    border: "2px dashed #0057A0",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
  },
  previewContainer: {
    marginTop: "1rem",
    textAlign: "center",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "450px",
    border: "2px solid #0057A0",
    borderRadius: "10px",
  },
  spinner: {
    textAlign: "center",
    marginTop: "1rem",
    fontWeight: "bold",
    color: "#FFD700",
  },
  formContainer: {
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor: "#fefbe8",
    borderRadius: "8px",
    border: "1px solid #FFD700",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
  },
};
