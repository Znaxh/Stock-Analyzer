import { useState } from 'react'
import { Plus, X, Calculator, TrendingUp, AlertCircle, Loader } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { capmAPI, popularStocks, formatStockSymbol, validateStockSymbol } from '../services/api'

const CAPMCalculator = () => {
  const [stocks, setStocks] = useState(['AAPL'])
  const [years, setYears] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [newStock, setNewStock] = useState('')

  const addStock = () => {
    const formattedStock = formatStockSymbol(newStock)
    if (!validateStockSymbol(formattedStock)) {
      setError('Please enter a valid stock symbol (1-5 letters)')
      return
    }
    if (stocks.includes(formattedStock)) {
      setError('Stock already added')
      return
    }
    if (stocks.length >= 10) {
      setError('Maximum 10 stocks allowed')
      return
    }
    setStocks([...stocks, formattedStock])
    setNewStock('')
    setError('')
  }

  const removeStock = (stockToRemove) => {
    if (stocks.length > 1) {
      setStocks(stocks.filter(stock => stock !== stockToRemove))
    }
  }

  const calculateCAPM = async () => {
    if (stocks.length === 0) {
      setError('Please add at least one stock')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const data = await capmAPI.calculate(stocks, years)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatChartData = () => {
    if (!results?.normalized_data) return []
    
    return results.normalized_data.map(item => ({
      date: new Date(item.Date).toLocaleDateString(),
      ...Object.keys(item).reduce((acc, key) => {
        if (key !== 'Date') {
          acc[key] = parseFloat(item[key]).toFixed(4)
        }
        return acc
      }, {})
    }))
  }

  const formatBetaData = () => {
    if (!results?.beta_results) return []
    
    return results.beta_results.map(item => ({
      stock: item.stock,
      beta: parseFloat(item.beta).toFixed(3),
      alpha: parseFloat(item.alpha).toFixed(3)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Calculator className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CAPM Calculator</h1>
            <p className="text-gray-600">Calculate Beta and Expected Returns using Capital Asset Pricing Model</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Symbols
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addStock()}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Selected Stocks */}
            <div className="flex flex-wrap gap-2 mb-3">
              {stocks.map((stock) => (
                <span
                  key={stock}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {stock}
                  {stocks.length > 1 && (
                    <button
                      onClick={() => removeStock(stock)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Popular Stocks */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Popular stocks:</p>
              <div className="flex flex-wrap gap-1">
                {popularStocks.slice(0, 6).map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      if (!stocks.includes(stock.symbol) && stocks.length < 10) {
                        setStocks([...stocks, stock.symbol])
                      }
                    }}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    disabled={stocks.includes(stock.symbol)}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Period (Years)
            </label>
            <select
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
            </select>

            {/* Calculate Button */}
            <button
              onClick={calculateCAPM}
              disabled={loading || stocks.length === 0}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate CAPM
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Market Return</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {(results.market_return * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Risk-Free Rate</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {(results.risk_free_rate * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">β</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg Beta</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {results.beta_results.length > 0 
                      ? (results.beta_results.reduce((sum, item) => sum + item.beta, 0) / results.beta_results.length).toFixed(3)
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">α</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg Alpha</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {results.beta_results.length > 0 
                      ? (results.beta_results.reduce((sum, item) => sum + item.alpha, 0) / results.beta_results.length).toFixed(3)
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Results Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Beta Analysis Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beta (β)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alpha (α)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.capm_results.map((result, index) => {
                    const beta = result.beta
                    const riskLevel = beta > 1.2 ? 'High' : beta > 0.8 ? 'Medium' : 'Low'
                    const riskColor = beta > 1.2 ? 'text-red-600' : beta > 0.8 ? 'text-yellow-600' : 'text-green-600'
                    
                    return (
                      <tr key={result.stock}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{beta.toFixed(3)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {results.beta_results[index]?.alpha.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(result.expected_return * 100).toFixed(2)}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${riskColor}`}>
                          {riskLevel}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          {formatChartData().length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Normalized Price Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Normalized Price Movement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {stocks.map((stock, index) => (
                      <Line
                        key={stock}
                        type="monotone"
                        dataKey={stock}
                        stroke={`hsl(${index * 360 / stocks.length}, 70%, 50%)`}
                        strokeWidth={2}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="^GSPC"
                      stroke="#000000"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Beta Comparison Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Beta Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatBetaData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stock" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="beta" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CAPMCalculator
