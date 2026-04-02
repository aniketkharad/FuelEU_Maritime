import React, { useState } from 'react';
import { poolingApi } from '../infrastructure/pooling.api';
import { Pool } from '../../core/domain/entities';

export function PoolingTab() {
    const [year, setYear] = useState('2024');
    const [memberIds, setMemberIds] = useState<string>('R001, R002');

    const [pool, setPool] = useState<Pool | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePool = async () => {
        if (!year || !memberIds) return;
        setLoading(true);
        setError(null);
        setPool(null);
        try {
            const y = parseInt(year);
            const members = memberIds.split(',').map(m => ({ shipId: m.trim() })).filter(m => m.shipId !== '');
            const createdPool = await poolingApi.createPool(y, members);
            setPool(createdPool);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Pooling Module</h2>
                <p className="text-sm text-gray-400 mt-1">Manage Article 21 pooling groups</p>
            </div>

            <div className="bg-dark-900/50 border border-dark-800 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="number"
                        placeholder="Year"
                        className="w-full md:w-32 px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ship IDs (comma separated, e.g. R001, R002)"
                        className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-md text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={memberIds}
                        onChange={(e) => setMemberIds(e.target.value)}
                    />
                    <button
                        onClick={handleCreatePool}
                        disabled={loading}
                        className="px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium rounded-md shadow-lg shadow-brand-500/20 transition-all font-sans whitespace-nowrap"
                    >
                        {loading ? 'Processing...' : 'Create Pool'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md text-red-200 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-3 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {error}
                    </div>
                )}

                {pool && (
                    <div className="mt-8 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-brand-900/20 border border-brand-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500/20 text-brand-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-gray-200 font-medium">Pool Registration Successful</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Pool ID: #{pool.id} — Year: {pool.year} — Members: {pool.members.length}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Net Pool Balance</span>
                                <div className="text-xl font-bold font-mono text-green-400">
                                    {pool.members.reduce((acc, m) => acc + m.cbAfter, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-dark-800 bg-dark-800/30">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-dark-800/80 border-b border-dark-700 text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Ship ID</th>
                                        <th className="px-4 py-3 font-semibold">CB Before (gCO₂e)</th>
                                        <th className="px-4 py-3 font-semibold">Allocation Shift</th>
                                        <th className="px-4 py-3 font-semibold">CB After (gCO₂e)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-800">
                                    {pool.members.map((m) => {
                                        const shift = m.cbAfter - m.cbBefore;
                                        return (
                                            <tr key={m.shipId} className="hover:bg-dark-700/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-200">{m.shipId}</td>
                                                <td className={`px-4 py-3 font-mono ${m.cbBefore >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                                                    {m.cbBefore.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {shift !== 0 ? (
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${shift > 0 ? 'bg-brand-900/30 text-brand-400' : 'bg-red-900/30 text-red-400'}`}>
                                                            {shift > 0 ? '+' : ''}{shift.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className={`px-4 py-3 font-mono font-medium ${m.cbAfter >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {m.cbAfter.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
