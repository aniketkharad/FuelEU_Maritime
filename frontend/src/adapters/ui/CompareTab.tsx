import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { routeApi } from '../infrastructure/route.api';
import { Route, ComparisonResult, TARGET_INTENSITY_2025 } from '../../core/domain/entities';

export function CompareTab() {
    const [baseline, setBaseline] = useState<Route | null>(null);
    const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComparison();
    }, []);

    const loadComparison = async () => {
        setLoading(true);
        try {
            const data = await routeApi.getComparison();
            setBaseline(data.baseline);
            setComparisons(data.comparisons);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-gray-400 text-center py-10 animate-pulse">Loading comparison data...</div>;
    }

    if (!baseline) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-dark-800/30 rounded-lg border border-dark-700/50">
                <div className="h-12 w-12 text-gray-500 mb-4 font-bold text-4xl">!</div>
                <h3 className="text-xl font-medium text-gray-300">No Baseline Selected</h3>
                <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">
                    Please go to the Routes tab and select a baseline route to see comparisons.
                </p>
            </div>
        );
    }

    const chartData = [
        {
            name: baseline.routeId + ' (Base)',
            intensity: baseline.ghgIntensity,
        },
        ...comparisons.map(c => ({
            name: c.routeId,
            intensity: c.ghgIntensity,
        }))
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Intensity Comparison</h2>
                <p className="text-sm text-gray-400 mt-1">Comparing against baseline: <span className="text-brand-400 font-medium">{baseline.routeId}</span> ({baseline.ghgIntensity} gCO₂e/MJ)</p>
            </div>

            <div className="h-[400px] w-full bg-dark-900/50 border border-dark-800 rounded-lg p-6 backdrop-blur-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[80, 'dataMax + 5']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
                            itemStyle={{ color: '#14b8a6' }}
                        />
                        <Legend />
                        <ReferenceLine y={TARGET_INTENSITY_2025} label={{ position: 'top', value: '2025 Target (89.34)', fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                        <ReferenceLine y={baseline.ghgIntensity} label={{ position: 'bottom', value: 'Baseline', fill: '#8b5cf6', fontSize: 12 }} stroke="#8b5cf6" strokeDasharray="3 3" />
                        <Bar dataKey="intensity" fill="#14b8a6" radius={[4, 4, 0, 0]} name="GHG Intensity (gCO₂e/MJ)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-lg border border-dark-800 bg-dark-900/50 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-dark-800 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Route ID</th>
                            <th className="px-4 py-3 font-semibold">Vessel Type</th>
                            <th className="px-4 py-3 font-semibold">GHG Intensity</th>
                            <th className="px-4 py-3 font-semibold">Diff %</th>
                            <th className="px-4 py-3 font-semibold">Compliant (2025)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800">
                        {comparisons.map((c) => (
                            <tr key={c.routeId} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-200">{c.routeId}</td>
                                <td className="px-4 py-3">{c.vesselType}</td>
                                <td className="px-4 py-3">{c.ghgIntensity.toFixed(2)}</td>
                                <td className="px-4 py-3 flex items-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.percentDiff > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                        {c.percentDiff > 0 ? '+' : ''}{c.percentDiff.toFixed(2)}%
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {c.compliant ? (
                                        <span className="flex items-center text-green-400 font-medium">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-400 font-medium">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            No
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
