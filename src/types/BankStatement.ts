export interface Transaction {
  date: string;
  description: string;
  montant: string;
  sens: string;
}

export interface BankStatement {
  banque: string | null;
  compte: string | null;
  titulaire: string | null;
  periode: string | null;
  transactions: Transaction[];
}
