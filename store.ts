
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Transaction, BudgetAllocation, BudgetItem, CategoryType } from './types';

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
          if (!Array.isArray(parsed.transactions)) return false;

          const validTypes: CategoryType[] = ['Need', 'Want', 'Saving', 'Income'];
          const isValidTransaction = (t: unknown): t is Transaction =>
            !!t && typeof t === 'object' &&
            typeof (t as Transaction).id === 'string' &&
            typeof (t as Transaction).description === 'string' &&
            typeof (t as Transaction).amount === 'number' && Number.isFinite((t as Transaction).amount) &&
            validTypes.includes((t as Transaction).type);

          if (!parsed.transactions.every(isValidTransaction)) return false;

          const isValidPlannedItem = (i: unknown): i is BudgetItem =>
            !!i && typeof i === 'object' &&
            typeof (i as BudgetItem).id === 'string' &&
            typeof (i as BudgetItem).description === 'string' &&
            typeof (i as BudgetItem).amount === 'number' && Number.isFinite((i as BudgetItem).amount) &&
            ['Need', 'Want', 'Saving'].includes((i as BudgetItem).type);

          const plannedItems = Array.isArray(parsed.plannedItems) && parsed.plannedItems.every(isValidPlannedItem)
            ? parsed.plannedItems
            : [];

          const income = typeof parsed.monthlyIncome === 'number' && Number.isFinite(parsed.monthlyIncome)
            ? parsed.monthlyIncome
            : 5000;

          set({
            transactions: parsed.transactions,
            plannedItems,
            customCategories: parsed.customCategories || defaultCategories,
            monthlyIncome: income,
            budgetAllocation: parsed.budgetAllocation || { needs: 50, wants: 30, savings: 20 }
          });
          return true;
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
