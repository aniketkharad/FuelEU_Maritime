import React, { useState } from 'react';
import { complianceApi } from '../../infrastructure/compliance.api';
import { bankingApi } from '../../infrastructure/banking.api';
import { ComplianceBalance, BankRecord } from '../../../core/domain/entities';

export function BankingTab() {
    const [shipId, setShipId] = useState('');
    const [year, setYear] = useState('2024');

    const [cbBefore, setCbBefore] = useState<ComplianceBalance | null>(null);
    const [adjustedCb, setAdjustedCb] = useState<ComplianceBalance | null>(null);
    const [records, setRecords] = useState<BankRecord[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [applyAmount, setApplyAmount] = useState<number | ''>('');

    const loadData = async () => {
        if (!shipId || !year) return;
        setLoading(true);
        setError(null);
        try {
            const y = parseInt(year);
            const [cbRes, adjCbRes, recRes] = await Promise.all([
                complianceApi.getComplianceBalance(shipId, y),
                complianceApi.getAdjustedCB(shipId, y),
                bankingApi.getBankRecords(shipId, y)
            ]);
            setCbBefore(cbRes);
            setAdjustedCb(adjCbRes);
            setRecords(recRes);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBank = async () => {
        try {
            await bankingApi.bankSurplus(shipId, parseInt(year));
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const handleApply = async () => {
        if (!applyAmount || isNaN(Number(applyAmount))) return;
        try {
            await bankingApi.applyBanked(shipId, parseInt(year), Number(applyAmount));
            await loadData();
            setApplyAmount('');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Banking Module</h2>
                <p className="text-sm text-gray-400 mt-1">Manage Article 20 banking compliance operations</p>
            </div>

            <div className="bg-dark-900/50 border border-dark-800 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Ship / Route ID (e.g., R001)"
                        className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={shipId}
                        onChange={(e) => setShipId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Year"
                        className="w-full md:w-32 px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                    <button
                        onClick={loadData}
                        className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-lg shadow-brand-500/20 transition-all font-sans"
                    >
                        Load Portfolios
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md text-red-200 text-sm mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-3 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 text-center text-gray-500 animate-pulse">Fetching ship compliance profile...</div>
                ) : cbBefore && adjustedCb && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-dark-800/80 rounded-lg p-5 border border-dark-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Initial CB</h4>
                                <div className="text-3xl font-bold text-white font-mono">{cbBefore.cbGco2eq.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-sans text-gray-500 font-normal">gCO₂e</span></div>
                                <p className="text-xs text-gray-500 mt-2">Compliance Balance before banking constraints</p>
                            </div>

                            <div className="bg-dark-800/80 rounded-lg p-5 border border-dark-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Adjusted CB</h4>
                                <div className={`text-3xl font-bold font-mono ${adjustedCb.cbGco2eq >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {adjustedCb.cbGco2eq.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-sans text-gray-500 font-normal">gCO₂e</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Value after applied banked surpluses</p>
                            </div>

                            <div className="bg-dark-800/80 rounded-lg p-5 border border-dark-700 flex flex-col justify-between">
                                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Actions</h4>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={handleBank}
                                        disabled={adjustedCb.cbGco2eq <= 0}
                                        className="w-full px-3 py-2 text-sm bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:hover:bg-dark-700 text-gray-200 rounded transition-colors"
                                    >
                                        Bank Surplus
                                    </button>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={applyAmount}
                                            onChange={(e) => setApplyAmount(Number(e.target.value))}
                                            className="w-full px-3 py-1.5 text-sm bg-dark-900 border border-dark-600 rounded text-gray-200 outline-none focus:border-brand-500"
                                        />
                                        <button
                                            onClick={handleApply}
                                            disabled={adjustedCb.cbGco2eq >= 0 || !applyAmount}
                                            className="px-3 py-1.5 text-sm bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 text-white rounded transition-colors whitespace-nowrap"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-4">Ledger Entries</h3>
                            <div className="overflow-hidden rounded-lg border border-dark-800 bg-dark-800/30">
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="bg-dark-800/80 border-b border-dark-700 text-xs uppercase text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Entry ID</th>
                                            <th className="px-4 py-3 font-semibold">Date</th>
                                            <th className="px-4 py-3 font-semibold">Type</th>
                                            <th className="px-4 py-3 font-semibold text-right">Amount (gCO₂e)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-800">
                                        {records.length === 0 ? (
                                            <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No bank ledger records found for this year.</td></tr>
                                        ) : (
                                            records.map((r) => (
                                                <tr key={r.id} className="hover:bg-dark-700/30 transition-colors">
                                                    <td className="px-4 py-3 font-mono text-gray-400">#{r.id}</td>
                                                    <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.amountGco2eq > 0 ? 'bg-brand-900/30 text-brand-400' : 'bg-red-900/30 text-red-400'}`}>
                                                            {r.amountGco2eq > 0 ? 'Applied' : 'Banked Out'}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 font-mono text-right ${r.amountGco2eq > 0 ? 'text-brand-400' : 'text-red-400'}`}>
                                                        {r.amountGco2eq > 0 ? '+' : ''}{r.amountGco2eq.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
