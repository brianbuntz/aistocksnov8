import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import _ from 'lodash';

const stockColors = {
  'Apple (AAPL)': '#FF9500',
  'C3.ai (AI)': '#FF2D55',
  'AMD (AMD)': '#5856D6',
  'Salesforce (CRM)': '#007AFF',
  'Google (GOOGL)': '#4CD964',
  'IBM (IBM)': '#5AC8FA',
  'Intel (INTC)': '#FFCC00',
  'Meta (META)': '#FF3B30',
  'Microsoft (MSFT)': '#34C759',
  'NVIDIA (NVDA)': '#AF52DE',
  'Oracle (ORCL)': '#FF9500',
  'Palantir (PLTR)': '#5856D6',
  'Tesla (TSLA)': '#FF375F',
  'Amazon (AMZN)': '#FFD60A',
  'Snowflake (SNOW)': '#30D158',
  'UiPath (PATH)': '#0A84FF'
};

const categories = {
  'Chip Makers': ['AMD (AMD)', 'Intel (INTC)', 'NVIDIA (NVDA)'],
  'Tech Giants': ['Apple (AAPL)', 'Google (GOOGL)', 'Microsoft (MSFT)', 'Meta (META)', 'Amazon (AMZN)'],
  'AI Pure Plays': ['C3.ai (AI)', 'Palantir (PLTR)', 'UiPath (PATH)'],
  'Enterprise Tech': ['Salesforce (CRM)', 'IBM (IBM)', 'Oracle (ORCL)', 'Snowflake (SNOW)']
};

const timeIntervals = [
  { label: '1W', value: 1 },
  { label: '1M', value: 4 },
  { label: '3M', value: 13 },
  { label: '6M', value: 26 },
  { label: 'YTD', value: 'ytd' },
];

const AIStocksDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState(['NVIDIA (NVDA)', 'Microsoft (MSFT)', 'Google (GOOGL)']);
  const [timeInterval, setTimeInterval] = useState(timeIntervals[4].value);
  const [showPrice, setShowPrice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('performance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fs.readFile('stock_data.json', { encoding: 'utf8' });
        const data = JSON.parse(response);
        setStockData(data);
      } catch (error) {
        console.error('Error loading stock data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!stockData.length) return [];

    const latestDate = new Date(stockData[stockData.length - 1].Date);
    const startOfYear = new Date(latestDate.getFullYear(), 0, 1);

    let startIndex;
    if (timeInterval === 'ytd') {
      startIndex = stockData.findIndex(item => new Date(item.Date) >= startOfYear);
    } else {
      const startDate = new Date(latestDate);
      startDate.setDate(startDate.getDate() - (timeInterval * 7));
      startIndex = stockData.findIndex(item => new Date(item.Date) >= startDate);
    }

    return stockData.slice(startIndex);
  }, [stockData, timeInterval]);

  const sortedStocks = useMemo(() => {
    const stocks = Object.keys(stockColors).filter(stock => {
      const matchesSearch = stock.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
        (categories[selectedCategory] && categories[selectedCategory].includes(stock));
      return matchesSearch && matchesCategory;
    });

    if (sortOrder === 'alphabetical') {
      return _.sortBy(stocks, [(s) => s.toLowerCase()]);
    } else if (sortOrder === 'performance' && filteredData.length > 0) {
      const lastData = filteredData[filteredData.length - 1];
      return _.orderBy(stocks, [
        (stock) => lastData[`PercentChange_${stock}`]
      ], ['desc']);
    }
    return stocks;
  }, [stockColors, searchTerm, selectedCategory, sortOrder, filteredData]);

  const getStockValue = (item, stock) => {
    const prefix = showPrice ? 'Price_' : 'PercentChange_';
    return item[prefix + stock];
  };

  const getPerformanceColor = (performance) => {
    if (performance > 5) return 'text-green-400';
    if (performance < -5) return 'text-red-400';
    return 'text-gray-200';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Stocks Performance Dashboard</h2>
        <p className="text-gray-300 text-sm">Track and compare performance of AI-related stocks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded text-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded text-white text-sm appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="relative">
          {sortOrder === 'alphabetical' ? (
            <SortAsc className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          ) : (
            <SortDesc className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          )}
          <select
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded text-white text-sm appearance-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="performance">Sort by Performance</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center">
        {timeIntervals.map((interval) => (
          <button
            key={interval.label}
            className={`mr-2 mb-2 px-3 py-1 text-sm rounded-full ${
              timeInterval === interval.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setTimeInterval(interval.value)}
          >
            {interval.label}
          </button>
        ))}
        <button
          className={`ml-4 px-3 py-1 text-sm rounded-full transition-colors ${
            showPrice 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setShowPrice(!showPrice)}
        >
          {showPrice ? 'Show %' : 'Show Price'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {sortedStocks.map((stock) => {
          const lastValue = filteredData.length > 0 
            ? filteredData[filteredData.length - 1][`PercentChange_${stock}`]
            : 0;
          
          return (
            <button
              key={stock}
              className={`p-2 rounded text-left ${
                selectedStocks.includes(stock) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedStocks(prev => 
                prev.includes(stock) ? prev.filter(s => s !== stock) : [...prev, stock]
              )}
            >
              <div className="text-sm font-medium">{stock.split(' ')[0]}</div>
              <div className={`text-xs ${getPerformanceColor(lastValue)}`}>
                {lastValue.toFixed(2)}%
              </div>
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="Date" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <YAxis 
            tickFormatter={(value) => showPrice ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`}
            domain={['auto', 'auto']}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [
              showPrice ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`, 
              name.split(' ')[0]
            ]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '0.375rem',
              color: '#F3F4F6' 
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
          />
          {selectedStocks.map((stock) => (
            <Line
              key={stock}
              type="monotone"
              dataKey={(item) => getStockValue(item, stock)}
              name={stock.split(' ')[0]}
              stroke={stockColors[stock]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AIStocksDashboard;
