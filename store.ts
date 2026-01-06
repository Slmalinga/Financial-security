
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Transaction, BudgetAllocation, BudgetItem } from './types';

const defaultCategories = {
  Need: ['Rent', 'Groceries', 'Utilities', 'Transport', 'Insurance'],
  Want: ['Dining Out', 'Streaming', 'Hobbies', 'Travel', 'Shopping'],
  Saving: ['Emergency Fund', 'Retirement', 'Stocks', 'Crypto', 'High-Yield Savings']
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: [],
      plannedItems: [],
      customCategories: defaultCategories,
      monthlyIncome: 5000,
      budgetAllocation: {
        needs: 50,
        wants: 30,
        savings: 20,
      },
      addTransaction: (t) => set((state) => ({ transactions: [t, ...state.transactions] })),
      deleteTransaction: (id) => set((state) => ({ 
        transactions: state.transactions.filter((t) => t.id !== id) 
      })),
      addPlannedItem: (item) => set((state) => ({
        plannedItems: [...state.plannedItems, item]
      })),
      removePlannedItem: (id) => set((state) => ({
        plannedItems: state.plannedItems.filter(i => i.id !== id)
      })),
      addCategory: (type, name) => set((state) => ({
        customCategories: {
          ...state.customCategories,
          [type]: [...new Set([...state.customCategories[type], name])]
        }
      })),
      removeCategory: (type, name) => set((state) => ({
        customCategories: {
          ...state.customCategories,
          [type]: state.customCategories[type].filter(cat => cat !== name)
        }
      })),
      setMonthlyIncome: (val) => set({ monthlyIncome: val }),
      setBudgetAllocation: (allocation) => set({ budgetAllocation: allocation }),
      importData: (dataStr) => {
        try {
          const parsed = JSON.parse(dataStr);
          if (Array.isArray(parsed.transactions)) {
            set({ 
              transactions: parsed.transactions, 
              plannedItems: parsed.plannedItems || [],
              customCategories: parsed.customCategories || defaultCategories,
              monthlyIncome: parsed.monthlyIncome || 5000,
              budgetAllocation: parsed.budgetAllocation || { needs: 50, wants: 30, savings: 20 }
            });
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
    }),
    {
      name: 'finsight-storage',
    }
  )
);
