
export type CategoryType = 'Need' | 'Want' | 'Saving' | 'Income';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: CategoryType;
}

export interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  type: 'Need' | 'Want' | 'Saving';
}

export interface BudgetAllocation {
  needs: number; // Percentage (0-100)
  wants: number; // Percentage (0-100)
  savings: number; // Percentage (0-100)
}

export interface AppState {
  transactions: Transaction[];
  plannedItems: BudgetItem[];
  customCategories: Record<'Need' | 'Want' | 'Saving', string[]>;
  monthlyIncome: number;
  budgetAllocation: BudgetAllocation;
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addPlannedItem: (item: BudgetItem) => void;
  removePlannedItem: (id: string) => void;
  addCategory: (type: 'Need' | 'Want' | 'Saving', name: string) => void;
  removeCategory: (type: 'Need' | 'Want' | 'Saving', name: string) => void;
  setMonthlyIncome: (val: number) => void;
  setBudgetAllocation: (allocation: BudgetAllocation) => void;
  importData: (data: string) => boolean;
}
