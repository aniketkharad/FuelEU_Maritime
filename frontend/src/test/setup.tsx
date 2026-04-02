import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Recharts to avoid SVG rendering issues in JSDOM
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{ children } </div>,
  BarChart: ({ children }: any) => <div>{ children } </div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ReferenceLine: () => <div />,
}));
