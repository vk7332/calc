import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ClientRecord } from '@/types/client';
import { supabase } from '@/supabase';
import { useAuth } from './AuthContext';

interface HistoryContextType {
    clients: ClientRecord[];
    addRecord: (record: Omit<ClientRecord, 'id' | 'lastCalculated'>) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredClients: ClientRecord[];
    loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<ClientRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load from Supabase on startup and when user changes
    useEffect(() => {
        if (user) {
            loadClients();
        } else {
            setClients([]);
            setLoading(false);
        }
    }, [user, loadClients]);

    const loadClients = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('client_records')
                .select('*')
                .eq('user_id', user.id)
                .order('last_calculated', { ascending: false });

            if (error) throw error;

            setClients(data || []);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addRecord = async (record: Omit<ClientRecord, 'id' | 'lastCalculated'>) => {
        if (!user) return;

        try {
            const newRecord: ClientRecord = {
                ...record,
                id: crypto.randomUUID(),
                lastCalculated: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('client_records')
                .insert({
                    ...newRecord,
                    user_id: user.id,
                });

            if (error) throw error;

            setClients((prev: ClientRecord[]) => [newRecord, ...prev]);
        } catch (error) {
            console.error('Error adding record:', error);
            throw error;
        }
    };

    const deleteRecord = async (id: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('client_records')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            setClients((prev: ClientRecord[]) => prev.filter((client: ClientRecord) => client.id !== id));
        } catch (error) {
            console.error('Error deleting record:', error);
            throw error;
        }
    };

    const clearAll = async () => {
        if (!user) return;

        if (!window.confirm("Are you sure you want to delete all client records?")) return;

        try {
            const { error } = await supabase
                .from('client_records')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setClients([]);
        } catch (error) {
            console.error('Error clearing records:', error);
            throw error;
        }
    };

    const filteredClients = clients.filter((client: ClientRecord) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.pan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <HistoryContext.Provider value={{
            clients, addRecord, deleteRecord, clearAll,
            searchQuery, setSearchQuery, filteredClients, loading
        }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};