import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  fileName: string;
  date: string;
}

export default function HistoriquePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(savedHistory);
  }, []);

  const handleDelete = (index: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce relevé ?")) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/download/${filename}`);
      if (!response.ok) throw new Error("Fichier non disponible");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors du téléchargement : " + err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📂 Historique des relevés exportés</h1>

      {history.length === 0 ? (
        <p style={styles.empty}>Aucun relevé exporté pour l’instant.</p>
      ) : (
        <div style={styles.card}>
          <ul style={styles.list}>
            {history.map((item, idx) => (
              <li key={idx} style={styles.item}>
                <span>
                  <strong>{item.fileName}</strong> — {item.date}
                </span>
                <div style={styles.actions}>
                  {/* <button
                    style={styles.downloadBtn}
                    onClick={() => handleDownload(item.fileName)}
                  >
                    ⬇ Télécharger
                  </button> */}
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(idx)}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate("/")} style={styles.backButton}>
        ⬅ Retour à l’accueil
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "22px", marginBottom: "20px", color: "#0057A0" },
  empty: { color: "#777", fontStyle: "italic" },
  card: {
    textAlign: "left",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  downloadBtn: {
    backgroundColor: "#0057A0",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteBtn: {
    backgroundColor: "#FF4D4D",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  backButton: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#FFD700",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
};
