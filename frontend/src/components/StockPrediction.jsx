import { useState } from 'react'
import { TrendingUp, Search, Calendar, Target, AlertTriangle, AlertCircle, Loader, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { stockPredictionAPI, popularStocks, formatStockSymbol, validateStockSymbol } from '../services/api'

const StockPrediction = () => {
  const [symbol, setSymbol] = useState('AAPL')
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const dayOptions = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' },
    { value: 60, label: '60 Days' },
    { value: 90, label: '90 Days' },
  ]

  const predictStock = async () => {
    const formattedSymbol = formatStockSymbol(symbol)
    if (!validateStockSymbol(formattedSymbol)) {
      setError('Please enter a valid stock symbol')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const data = await stockPredictionAPI.predict(formattedSymbol, days)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatChartData = () => {
    if (!results) return []
    
    const historicalData = results.historical_data.slice(-60).map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      historical: parseFloat(item.price),
      fullDate: item.date,
      type: 'historical'
    }))

    const predictionData = results.predictions.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      predicted: parseFloat(item.predicted_price),
      confidence_upper: item.confidence_interval_upper ? parseFloat(item.confidence_interval_upper) : null,
      confidence_lower: item.confidence_interval_lower ? parseFloat(item.confidence_interval_lower) : null,
      fullDate: item.date,
      type: 'prediction'
    }))

    // Connect historical and prediction data
    const lastHistorical = historicalData[historicalData.length - 1]
    const firstPrediction = predictionData[0]
    
    if (lastHistorical && firstPrediction) {
      firstPrediction.historical = lastHistorical.historical
    }

    return [...historicalData, ...predictionData]
  }

  const calculatePredictionStats = () => {
    if (!results?.predictions || results.predictions.length === 0) return null

    const predictions = results.predictions
    const firstPrice = predictions[0].predicted_price
    const lastPrice = predictions[predictions.length - 1].predicted_price
    const change = lastPrice - firstPrice
    const changePercent = (change / firstPrice) * 100

    const currentPrice = results.historical_data[results.historical_data.length - 1]?.price || 0
    const predictedChange = lastPrice - currentPrice
    const predictedChangePercent = (predictedChange / currentPrice) * 100

    return {
      firstPrice,
      lastPrice,
      change,
      changePercent,
      currentPrice,
      predictedChange,
      predictedChangePercent
    }
  }

  const stats = results ? calculatePredictionStats() : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Prediction</h1>
            <p className="text-gray-600">Predict future stock prices using ARIMA time series models</p>
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
              onKeyPress={(e) => e.key === 'Enter' && predictStock()}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prediction Period
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {dayOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={predictStock}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Predict Prices
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

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> Stock predictions are based on historical data and statistical models. 
            They should not be considered as financial advice. Always consult with financial professionals before making investment decisions.
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
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Current Price</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${stats?.currentPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Predicted Price</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${stats?.lastPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                {stats?.predictedChange >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-red-600 transform rotate-180" />
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Expected Change</p>
                  <p className={`text-xl font-semibold ${stats?.predictedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.predictedChange >= 0 ? '+' : ''}${stats?.predictedChange.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">%</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Expected Change %</p>
                  <p className={`text-xl font-semibold ${stats?.predictedChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.predictedChangePercent >= 0 ? '+' : ''}{stats?.predictedChangePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Prediction Chart</h3>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'historical') return [`$${value?.toFixed(2)}`, 'Historical Price']
                    if (name === 'predicted') return [`$${value?.toFixed(2)}`, 'Predicted Price']
                    if (name === 'confidence_upper') return [`$${value?.toFixed(2)}`, 'Upper Confidence']
                    if (name === 'confidence_lower') return [`$${value?.toFixed(2)}`, 'Lower Confidence']
                    return [value, name]
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls={false}
                />
                {results.predictions[0]?.confidence_interval_upper && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="confidence_upper"
                      stroke="#10B981"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      dot={false}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence_lower"
                      stroke="#EF4444"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      dot={false}
                      connectNulls={false}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Model Information */}
          {results.model_info && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.model_info).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-lg font-semibold text-gray-700 mt-1">
                      {typeof value === 'number' ? value.toFixed(4) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prediction Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Predictions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Price</th>
                    {results.predictions[0]?.confidence_interval_upper && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lower Bound</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upper Bound</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.predictions.slice(0, 10).map((prediction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prediction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${prediction.predicted_price.toFixed(2)}
                      </td>
                      {prediction.confidence_interval_lower && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${prediction.confidence_interval_lower.toFixed(2)}
                        </td>
                      )}
                      {prediction.confidence_interval_upper && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${prediction.confidence_interval_upper.toFixed(2)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.predictions.length > 10 && (
              <p className="text-sm text-gray-500 mt-3">
                Showing first 10 predictions. Total: {results.predictions.length} predictions.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StockPrediction
