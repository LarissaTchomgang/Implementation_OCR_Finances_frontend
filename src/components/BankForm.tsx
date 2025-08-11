// src/components/BankForm.tsx

import React from "react";

interface BankFormProps {
  data: {
    banque: string;
    compte: string;
    titulaire: string;
    periode: string;
  };
  onChange?: (field: string, value: string) => void;
  readOnly?: boolean;
}

const BankForm: React.FC<BankFormProps> = ({ data, onChange, readOnly = false }) => {
  // Fonction pour mettre à jour les champs
  const handleChange = (field: string, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.sectionTitle}>📄 Informations bancaires</h3>

      <div style={styles.row}>
        <label style={styles.label}>🏦 Banque</label>
        <input
          type="text"
          value={data.banque}
          onChange={(e) => handleChange("banque", e.target.value)}
          readOnly={readOnly}
          style={readOnly ? styles.inputReadOnly : styles.input}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>💳 Compte</label>
        <input
          type="text"
          value={data.compte}
          onChange={(e) => handleChange("compte", e.target.value)}
          readOnly={readOnly}
          style={readOnly ? styles.inputReadOnly : styles.input}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>👤 Titulaire</label>
        <input
          type="text"
          value={data.titulaire}
          onChange={(e) => handleChange("titulaire", e.target.value)}
          readOnly={readOnly}
          style={readOnly ? styles.inputReadOnly : styles.input}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>🗓️ Période</label>
        <input
          type="text"
          value={data.periode}
          onChange={(e) => handleChange("periode", e.target.value)}
          readOnly={readOnly}
          style={readOnly ? styles.inputReadOnly : styles.input}
        />
      </div>
    </div>
  );
};

export default BankForm;

// === STYLES IN-LINE (aucune dépendance nécessaire) ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    marginBottom: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#0057A0", // Bleu SAPHIR
    marginBottom: "15px",
    textAlign: "center",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outlineColor: "#0057A0",
  },
  inputReadOnly: {
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "6px",
    backgroundColor: "#f4f4f4",
    color: "#888",
    fontSize: "14px",
  },
};
