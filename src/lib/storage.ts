import type { KanbanData } from '../types';
import initialData from '../data/data.json';

const STORAGE_KEY = 'kanban-data';

/**
 * Load data from localStorage, fallback to initial data.json
 */
export function loadData(): KanbanData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as KanbanData;
        }
    } catch (error) {
        console.warn('Failed to load data from localStorage:', error);
    }

    // Return initial data as fallback
    return initialData as KanbanData;
}

/**
 * Save data to localStorage
 */
export function saveData(data: KanbanData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save data to localStorage:', error);
    }
}

/**
 * Clear all data from localStorage (useful for testing/reset)
 */
export function clearData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear data from localStorage:', error);
    }
}