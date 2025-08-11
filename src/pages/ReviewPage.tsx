import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateExcelFromData } from "../api/ocr";
import BankForm from "../components/BankForm";
import TransactionTable from "../components/TransactionTable";
import { Button } from "../components/ui/Button";

const ReviewPage: React.FC = () => {
  const [formData, setFormData] = useState<any | null>(null);
  const navigate = useNavigate();

  // Chargement des données depuis le localStorage
  useEffect(() => {
    const data = localStorage.getItem("formData");
    if (data) {
      setFormData(JSON.parse(data));
    }
  }, []);

  // Gestion du changement dans les champs bancaires
  const handleChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  // Gestion du changement dans les transactions
  const handleTransactionChange = (index: number, field: string, value: string) => {
    if (!formData) return;
    const updated = [...formData.transactions];
    updated[index][field] = value;
    setFormData({ ...formData, transactions: updated });
  };

  // Validation et génération Excel
  const handleValidate = async () => {
    if (!formData) return;
    const res = await generateExcelFromData(formData);
    alert("Fichier Excel généré : " + res.excel_file);
    navigate("/");
  };

  // Ajouter une nouvelle ligne vide
  const addTransaction = () => {
    setFormData({
      ...formData,
      transactions: [
        ...formData.transactions,
        { date: "", description: "", montant: "", sens: "" },
      ],
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✏️ Modifier les données extraites</h2>

      {formData ? (
        <>
          <BankForm data={formData} onChange={handleChange} />
          <TransactionTable
            transactions={formData.transactions}
            onChange={handleTransactionChange}
            readOnly={false}
          />

          <div style={styles.buttons}>
            <Button onClick={addTransaction} className="mt-4">
              ➕ Ajouter une transaction
            </Button>
            <Button onClick={handleValidate} style={{ marginLeft: "1rem" }}>
              ✅ Valider et Générer Excel
            </Button>
          </div>
        </>
      ) : (
        <p style={{ color: "#888", marginTop: "1rem" }}>Aucune donnée à afficher</p>
      )}
    </div>
  );
};

export default ReviewPage;

// === STYLES ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0057A0", // Bleu SAPHIR
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },
};
