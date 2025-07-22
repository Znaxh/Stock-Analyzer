import { X } from 'lucide-react'

const Sidebar = ({ navigation, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-56 xl:w-60">
          <div className="flex flex-col flex-grow bg-slate-800 border-r border-slate-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-lg font-semibold text-white">Navigation</h2>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`${
                        activeTab === item.id
                          ? 'bg-blue-900/50 border-blue-400 text-blue-300'
                          : 'border-transparent text-gray-300 hover:bg-slate-700 hover:text-white'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left transition-colors duration-200`}
                    >
                      <Icon
                        className={`${
                          activeTab === item.id ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                        } mr-3 h-5 w-5`}
                      />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-56 bg-slate-800 shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`${
                      activeTab === item.id
                        ? 'bg-blue-900/50 border-blue-400 text-blue-300'
                        : 'border-transparent text-gray-300 hover:bg-slate-700 hover:text-white'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left transition-colors duration-200`}
                  >
                    <Icon
                      className={`${
                        activeTab === item.id ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
