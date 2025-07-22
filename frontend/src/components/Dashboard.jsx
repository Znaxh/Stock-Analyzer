import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  Menu, 
  X,
  Home,
  Activity,
  Target
} from 'lucide-react'
import Sidebar from './Sidebar'
import CAPMCalculator from './CAPMCalculator'
import StockAnalysis from './StockAnalysis'
import StockPrediction from './StockPrediction'
import DashboardHome from './DashboardHome'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen])

  const navigation = [
    { id: 'home', name: 'Dashboard', icon: Home },
    { id: 'capm', name: 'CAPM Calculator', icon: Calculator },
    { id: 'analysis', name: 'Stock Analysis', icon: Activity },
    { id: 'prediction', name: 'Stock Prediction', icon: TrendingUp },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome setActiveTab={setActiveTab} />
      case 'capm':
        return <CAPMCalculator />
      case 'analysis':
        return <StockAnalysis />
      case 'prediction':
        return <StockPrediction />
      default:
        return <DashboardHome setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay - click outside to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        navigation={navigation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Stocklyzer</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm text-gray-600">
                  Real-time Stock Analysis & Prediction
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
