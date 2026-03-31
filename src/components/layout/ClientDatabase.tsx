import { useState } from 'react';
import { useHistory } from '@/context/HistoryContext';
import { useSettings } from '@/context/SettingsContext';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import { exportTaxReport } from '@/utils/pdfGenerator';
import { Client } from '@/types/client';

export const ClientDatabase = () => {
    const { clients, deleteRecord, clearAll, searchQuery, setSearchQuery, loading } = useHistory();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this client record?")) return;

        try {
            setDeletingId(id);
            await deleteRecord(id);
        } catch (error) {
            console.error('Error deleting record:', error);
            alert("Failed to delete record. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearAll = async () => {
        try {
            await clearAll();
        } catch (error) {
            console.error('Error clearing records:', error);
            alert("Failed to clear records. Please try again.");
        }
    };

    const { settings } = useSettings();

    const handleExport = async (client: Client) => {
        try {
            if (client.pdfData) {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${client.pdfData}`;
                link.download = `${client.name}_tax_report.pdf`;
                link.click();
                return;
            }

            if (client.auditReport && settings) {
                const pdfBase64 = exportTaxReport(client.auditReport, client.name, settings);
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${pdfBase64}`;
                link.download = `${client.name}_tax_report.pdf`;
                link.click();
            }
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert("Failed to export PDF. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={24} />
                <span className="ml-2 text-slate-600">Loading client records...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search by client name or PAN..."
                    className="flex-1 p-3 rounded-xl border border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {clients.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid gap-3">
                {clients.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        No client records found. Save some audits to see them here.
                    </div>
                ) : (
                    clients.map(client => (
                        <div key={client.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{client.name}</h4>
                                <p className="text-[10px] text-slate-400 uppercase">
                                    {client.lastCalculated ? new Date(client.lastCalculated).toLocaleDateString() : 'Unknown date'} •
                                    Income: ₹{client.totalIncome?.toLocaleString() || 'N/A'} •
                                    Tax: ₹{client.taxLiability?.toLocaleString() || 'N/A'}
                                </p>
                                {client.pan && <p className="text-xs text-slate-500">PAN: {client.pan}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleExport(client)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Export PDF"
                                >
                                    <FileText size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(client.id)}
                                    disabled={deletingId === client.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                    title="Delete Record"
                                >
                                    {deletingId === client.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};