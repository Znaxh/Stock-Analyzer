import { Calculator, Activity, TrendingUp, BarChart3, Target, Zap } from 'lucide-react'

const DashboardHome = ({ setActiveTab }) => {
  const features = [
    {
      id: 'capm',
      title: 'CAPM Calculator',
      description: 'Calculate Beta and Expected Returns using the Capital Asset Pricing Model. Analyze stock performance against market benchmarks.',
      icon: Calculator,
      color: 'bg-blue-500',
      stats: 'Risk Analysis'
    },
    {
      id: 'analysis',
      title: 'Stock Analysis',
      description: 'Comprehensive technical analysis with indicators, price trends, and volume analysis for informed decision making.',
      icon: Activity,
      color: 'bg-green-500',
      stats: 'Technical Indicators'
    },
    {
      id: 'prediction',
      title: 'Stock Prediction',
      description: 'Predict future stock prices using ARIMA models. Get 30-day forecasts with confidence intervals.',
      icon: TrendingUp,
      color: 'bg-purple-500',
      stats: 'ARIMA Forecasting'
    }
  ]

  const stats = [
    { name: 'Market Coverage', value: 'Global', icon: Target },
    { name: 'Real-time Data', value: 'Live', icon: Zap },
    { name: 'Analysis Tools', value: '3+', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Welcome to Stocklyzer</h1>
          <p className="text-blue-100 text-lg">
            Your comprehensive stock analysis and prediction platform. Forecast the future, analyze the past, and make smarter investment decisions.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setActiveTab(feature.id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${feature.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.stats}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab(feature.id)
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Choose Your Tool</h3>
            <p className="text-sm text-gray-600">Select from CAPM Calculator, Stock Analysis, or Stock Prediction based on your needs.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-semibold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Enter Stock Symbol</h3>
            <p className="text-sm text-gray-600">Input the stock ticker symbol (e.g., AAPL, GOOGL) or search by company name.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-semibold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Analyze Results</h3>
            <p className="text-sm text-gray-600">View interactive charts, technical indicators, and predictions to make informed decisions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
