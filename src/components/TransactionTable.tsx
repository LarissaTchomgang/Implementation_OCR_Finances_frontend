import React, { ChangeEvent } from "react";

interface Transaction {
  date: string;
  description: string;
  montant: string;
  sens: string;
}

interface Props {
  transactions: Transaction[];
  readOnly?: boolean;
  onChange?: (index: number, field: keyof Transaction, value: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onChange, readOnly = false }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🧾 Transactions</h3>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Montant</th>
            <th style={styles.th}>Sens</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i}>
              <td style={styles.td}>
                <input
                  style={styles.input}
                  value={tx.date}
                  readOnly={readOnly}
                  placeholder="Date"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange?.(i, "date", e.target.value)
                  }
                />
              </td>
              <td style={styles.td}>
                <input
                  style={styles.input}
                  value={tx.description}
                  readOnly={readOnly}
                  placeholder="Description"
                  onChange={(e) =>
                    onChange?.(i, "description", e.target.value)
                  }
                />
              </td>
              <td style={styles.td}>
                <input
                  style={styles.input}
                  value={tx.montant}
                  readOnly={readOnly}
                  placeholder="Montant"
                  onChange={(e) =>
                    onChange?.(i, "montant", e.target.value)
                  }
                />
              </td>
              <td style={styles.td}>
                <input
                  style={styles.input}
                  value={tx.sens}
                  readOnly={readOnly}
                  placeholder="Sens"
                  onChange={(e) =>
                    onChange?.(i, "sens", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: "2rem",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#0057A0",
  },
  table: {
    borderCollapse: "collapse",
    tableLayout: "auto", // largeur auto
  },
  headerRow: {
    backgroundColor: "#FFD700",
    color: "#000",
  },
  th: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    whiteSpace: "nowrap", // reste sur une seule ligne
  },
  td: {
    padding: "6px 10px",
    border: "1px solid #ccc",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
    descriptionCol: {
    minWidth: "300px", // <- colonne Description plus large
    maxWidth: "400px",
  },
  input: {
    padding: "4px 8px",
    fontSize: "14px",
    border: "1px solid #aaa",
    borderRadius: "4px",
  },
};
