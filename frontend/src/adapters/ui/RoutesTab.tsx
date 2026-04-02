import React, { useEffect, useState, useMemo } from 'react';
import { routeApi } from '../../infrastructure/route.api';
import { Route } from '../../../core/domain/entities';

export function RoutesTab() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVessel, setFilterVessel] = useState('');
    const [filterFuel, setFilterFuel] = useState('');
    const [filterYear, setFilterYear] = useState('');

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setLoading(true);
        try {
            const data = await routeApi.getAllRoutes();
            setRoutes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const setBaseline = async (routeId: string) => {
        try {
            await routeApi.setBaseline(routeId);
            loadRoutes();
        } catch (err) {
            alert('Failed to set baseline');
        }
    };

    const filteredRoutes = useMemo(() => {
        return routes.filter((r) => {
            const matchVessel = filterVessel ? r.vesselType.includes(filterVessel) : true;
            const matchFuel = filterFuel ? r.fuelType.includes(filterFuel) : true;
            const matchYear = filterYear ? r.year.toString() === filterYear : true;
            return matchVessel && matchFuel && matchYear;
        });
    }, [routes, filterVessel, filterFuel, filterYear]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">Vessel Routes & Data</h2>
                <div className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Filter Vessel Type"
                        className="px-3 py-2 bg-dark-800 border border-dark-700 rounded text-sm text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={filterVessel}
                        onChange={(e) => setFilterVessel(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter Fuel Type"
                        className="px-3 py-2 bg-dark-800 border border-dark-700 rounded text-sm text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={filterFuel}
                        onChange={(e) => setFilterFuel(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter Year"
                        className="px-3 py-2 bg-dark-800 border border-dark-700 rounded text-sm text-gray-200 outline-none focus:border-brand-500 transition-colors"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-dark-800 bg-dark-900/50 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-dark-800 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Route ID</th>
                            <th className="px-4 py-3 font-semibold">Vessel Type</th>
                            <th className="px-4 py-3 font-semibold">Fuel Type</th>
                            <th className="px-4 py-3 font-semibold">Year</th>
                            <th className="px-4 py-3 font-semibold">GHG Intensity</th>
                            <th className="px-4 py-3 font-semibold">Consumption (t)</th>
                            <th className="px-4 py-3 font-semibold">Distance (km)</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800">
                        {loading ? (
                            <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading routes...</td></tr>
                        ) : filteredRoutes.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No routes found matching filters.</td></tr>
                        ) : (
                            filteredRoutes.map((route) => (
                                <tr key={route.routeId} className={`hover:bg-dark-800/50 transition-colors ${route.isBaseline ? 'bg-brand-900/10 border-l-2 border-brand-500' : ''}`}>
                                    <td className="px-4 py-3 font-medium text-gray-200">
                                        {route.routeId}
                                        {route.isBaseline && <span className="ml-2 inline-flex items-center rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-400">Baseline</span>}
                                    </td>
                                    <td className="px-4 py-3">{route.vesselType}</td>
                                    <td className="px-4 py-3">{route.fuelType}</td>
                                    <td className="px-4 py-3">{route.year}</td>
                                    <td className="px-4 py-3">{route.ghgIntensity.toFixed(2)} gCO₂e/MJ</td>
                                    <td className="px-4 py-3">{route.fuelConsumption}</td>
                                    <td className="px-4 py-3">{route.distance}</td>
                                    <td className="px-4 py-3 text-right">
                                        {!route.isBaseline && (
                                            <button
                                                onClick={() => setBaseline(route.routeId)}
                                                className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors border border-brand-500/30 hover:border-brand-500/60 rounded px-3 py-1.5"
                                            >
                                                Set Baseline
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
