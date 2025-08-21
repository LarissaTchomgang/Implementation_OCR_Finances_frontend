import React, { useState, useEffect } from "react";
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
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  // Charger l’historique au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

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
      alert("❌ Une erreur est survenue lors de l'extraction.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!formData) return;
    try {
      const res = await generateExcelFromData(formData);

      // Ajouter à l’historique
      const newEntry = {
        fileName: file?.name || "Relevé",
        excelFile: res.excel_file,
        date: new Date().toLocaleString(),
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));

      alert("✅ Fichier Excel généré : " + res.excel_file);
    } catch (err) {
      alert("❌ Erreur lors de la génération du fichier Excel.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTransactionChange = (index: number, field: string, value: string) => {
    const updated = [...formData.transactions];
    updated[index][field] = value;
    setFormData({ ...formData, transactions: updated });
  };

  const handleReset = () => {
    setFile(null);
    setFormData(null);
    setImagePreview(null);
    localStorage.removeItem("formData");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Extraction Automatique de Relevé Bancaire</h1>

      {/* Texte explicatif si aucun fichier */}
      {!file && (
        <div style={styles.introBox}>
          <p>
            Cette application vous permet d’extraire automatiquement les informations clés d’un relevé bancaire
            (banque, titulaire, compte, transactions, etc.) à partir d’une image et de générer le document Excel correspondant. <br />
            <br />
            📎 Pour commencer, choisissez un fichier. Un aperçu et un formulaire prérempli apparaîtront.
          </p>
        </div>
      )}

      {/* Upload */}
      {!imagePreview && (
        <div style={styles.uploadPlaceholder}>
          <label style={styles.fileUploadLabel}>
            📁 Choisir un fichier
            <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleFileChange} />
          </label>
        </div>
      )}

      {/* Aperçu */}
      {imagePreview && (
        <div style={styles.previewContainer}>
          <img src={imagePreview} alt="Aperçu" style={styles.imagePreview} />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button onClick={handleUpload}>🔍 Lancer l'extraction</Button>
            <Button onClick={handleReset} variant="outline">♻️ Réinitialiser</Button>

          </div>
        </div>
      )}

      {loading && <p style={styles.spinner}>⏳ Extraction en cours...</p>}

      {/* Résultat */}
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
            <Button onClick={handleReset} variant="outline">♻️ Réinitialiser</Button>

          </div>
        </div>
      )}

{/* Bouton pour accéder à l'historique */}
<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  <button
    onClick={() => navigate("/historique")}
    style={{
      backgroundColor: "#0057A0",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background 0.3s",
      fontWeight: "bold",
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.backgroundColor = "#004080")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.backgroundColor = "#0057A0")
    }
  >
    📂 Voir l’historique
  </button>
</div>

      {/* Historique
      {history.length > 0 && (
        <div style={styles.historyBox}>
          <h2>📂 Historique des relevés exportés</h2>
          <button 
            onClick={() => navigate("/historique")} 
            style={styles.linkButton}
          >
            Voir tout l’historique →
          </button>
        </div>
      )} */}

    </div>
  );
};

export default HomePage;

// 🎨 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    maxWidth: "950px",
    margin: "auto",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "28px",
    color: "#0057A0",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  introBox: {
    backgroundColor: "#FFF8DC",
    padding: "1rem 1.5rem",
    borderRadius: "10px",
    border: "1px solid #FFD700",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  fileUploadLabel: {
    display: "inline-block",
    backgroundColor: "#FFD700",
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
  historyBox: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f4f9ff",
    border: "1px solid #0057A0",
    borderRadius: "10px",
  },
  historyItem: {
    marginBottom: "0.5rem",
  },
  link: {
    marginLeft: "1rem",
    color: "#0057A0",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};
