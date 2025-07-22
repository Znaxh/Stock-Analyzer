import { useState } from 'react'
import { Activity, Search, TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle, Loader } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { stockAnalysisAPI, popularStocks, formatStockSymbol, validateStockSymbol } from '../services/api'

const StockAnalysis = () => {
  const [symbol, setSymbol] = useState('AAPL')
  const [period, setPeriod] = useState('1y')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const periods = [
    { value: '1d', label: '1 Day' },
    { value: '5d', label: '5 Days' },
    { value: '1mo', label: '1 Month' },
    { value: '3mo', label: '3 Months' },
    { value: '6mo', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '2y', label: '2 Years' },
    { value: '5y', label: '5 Years' },
  ]

  const analyzeStock = async () => {
    const formattedSymbol = formatStockSymbol(symbol)
    if (!validateStockSymbol(formattedSymbol)) {
      setError('Please enter a valid stock symbol')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const data = await stockAnalysisAPI.analyze(formattedSymbol, period)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPriceData = () => {
    if (!results?.price_data) return []
    
    return results.price_data.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      price: parseFloat(item.price),
      fullDate: item.date
    }))
  }

  const calculatePriceChange = () => {
    if (!results?.price_data || results.price_data.length < 2) return { change: 0, percentage: 0 }
    
    const latest = results.price_data[results.price_data.length - 1].price
    const previous = results.price_data[results.price_data.length - 2].price
    const change = latest - previous
    const percentage = (change / previous) * 100
    
    return { change, percentage }
  }

  const renderTechnicalIndicators = () => {
    if (!results?.technical_indicators) return null

    const indicators = results.technical_indicators
    const indicatorCards = []

    // Moving Averages
    if (indicators.moving_averages?.ma_10 !== undefined && indicators.moving_averages.ma_10 !== null) {
      indicatorCards.push({
        title: 'MA (10)',
        value: indicators.moving_averages.ma_10.toFixed(2),
        description: '10-day Moving Average'
      })
    }

    if (indicators.moving_averages?.ma_20 !== undefined && indicators.moving_averages.ma_20 !== null) {
      indicatorCards.push({
        title: 'MA (20)',
        value: indicators.moving_averages.ma_20.toFixed(2),
        description: '20-day Moving Average'
      })
    }

    if (indicators.moving_averages?.ma_50 !== undefined && indicators.moving_averages.ma_50 !== null) {
      indicatorCards.push({
        title: 'MA (50)',
        value: indicators.moving_averages.ma_50.toFixed(2),
        description: '50-day Moving Average'
      })
    }

    // RSI
    if (indicators.rsi !== undefined && indicators.rsi !== null) {
      const rsi = indicators.rsi
      const rsiColor = rsi > 70 ? 'text-red-600' : rsi < 30 ? 'text-green-600' : 'text-yellow-600'
      const rsiStatus = rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'

      indicatorCards.push({
        title: 'RSI',
        value: rsi.toFixed(2),
        description: `Relative Strength Index - ${rsiStatus}`,
        color: rsiColor
      })
    }

    // MACD
    if (indicators.macd !== undefined && indicators.macd.macd !== undefined && indicators.macd.macd !== null) {
      indicatorCards.push({
        title: 'MACD',
        value: indicators.macd.macd.toFixed(4),
        description: 'Moving Average Convergence Divergence'
      })
    }

    // MACD Signal
    if (indicators.macd !== undefined && indicators.macd.signal !== undefined && indicators.macd.signal !== null) {
      indicatorCards.push({
        title: 'MACD Signal',
        value: indicators.macd.signal.toFixed(4),
        description: 'MACD Signal Line'
      })
    }

    // MACD Histogram
    if (indicators.macd !== undefined && indicators.macd.histogram !== undefined && indicators.macd.histogram !== null) {
      const histogram = indicators.macd.histogram
      const histogramColor = histogram > 0 ? 'text-green-600' : 'text-red-600'

      indicatorCards.push({
        title: 'MACD Histogram',
        value: histogram.toFixed(4),
        description: 'MACD Histogram (MACD - Signal)',
        color: histogramColor
      })
    }

    // Bollinger Bands
    if (indicators.bollinger_bands?.upper !== undefined && indicators.bollinger_bands.upper !== null) {
      indicatorCards.push({
        title: 'Bollinger Upper',
        value: indicators.bollinger_bands.upper.toFixed(2),
        description: 'Upper Bollinger Band'
      })
    }

    if (indicators.bollinger_bands?.middle !== undefined && indicators.bollinger_bands.middle !== null) {
      indicatorCards.push({
        title: 'Bollinger Middle',
        value: indicators.bollinger_bands.middle.toFixed(2),
        description: 'Middle Bollinger Band (SMA 20)'
      })
    }

    if (indicators.bollinger_bands?.lower !== undefined && indicators.bollinger_bands.lower !== null) {
      indicatorCards.push({
        title: 'Bollinger Lower',
        value: indicators.bollinger_bands.lower.toFixed(2),
        description: 'Lower Bollinger Band'
      })
    }

    return indicatorCards
  }

  const priceChange = results ? calculatePriceChange() : { change: 0, percentage: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Activity className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Analysis</h1>
            <p className="text-gray-600">Comprehensive technical analysis with indicators and price trends</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={analyzeStock}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Stock
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular Stocks */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {popularStocks.slice(0, 8).map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSymbol(stock.symbol)}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {stock.symbol}
              </button>
            ))}
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
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Current Price</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${results.current_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                {priceChange.change >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Price Change</p>
                  <p className={`text-xl font-semibold ${priceChange.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange.change >= 0 ? '+' : ''}${priceChange.change.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Change %</p>
                  <p className={`text-xl font-semibold ${priceChange.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Symbol</p>
                  <p className="text-xl font-semibold text-gray-900">{results.symbol}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={formatPriceData()}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Indicators */}
          {renderTechnicalIndicators() && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderTechnicalIndicators().map((indicator, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{indicator.title}</h4>
                    <p className={`text-2xl font-bold ${indicator.color || 'text-gray-900'}`}>
                      {indicator.value}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Information */}
          {results.summary && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(results.summary).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-gray-900">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StockAnalysis
