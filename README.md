# 📈 Stock-Analyzer

A comprehensive stock analysis and prediction platform featuring real-time market data, technical analysis, CAPM calculations, and ARIMA-based price forecasting.

## 🚀 Features

### 📊 CAPM Calculator
- Calculate Beta and Expected Returns using Capital Asset Pricing Model
- Analyze stock risk vs market performance
- Interactive price performance charts
- Compare multiple stocks simultaneously

### 📉 Stock Technical Analysis
- Real-time stock data visualization
- Technical indicators and moving averages
- Volume analysis and trend identification
- Historical price charts with multiple timeframes

### 📈 Stock Prediction
- 30-day price forecasting using ARIMA models
- Interactive prediction charts
- Model accuracy metrics (RMSE)
- Search by stock ticker or company name

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Streamlit**: Interactive web app framework
- **yFinance**: Real-time financial data
- **Pandas & NumPy**: Data manipulation and analysis
- **Plotly**: Interactive visualizations
- **Statsmodels**: ARIMA time series modeling
- **Scikit-learn**: Machine learning utilities

### Frontend
- **React 19**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: React charting library
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons

## 📂 Project Structure

```
Stock-Analyzer/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── Home.py                 # Streamlit main page
│   ├── pages/                  # Streamlit pages
│   │   ├── 1_CAPM_Calculator.py
│   │   ├── 2_Stock_Analysis.py
│   │   └── Stock_Prediction.py
│   ├── routers/                # FastAPI route handlers
│   │   ├── capm.py
│   │   ├── stock_analysis.py
│   │   └── stock_prediction.py
│   ├── models/                 # Pydantic models
│   └── requirements.txt
├── frontend/
│   ├── src/                    # React source code
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Stock-Analyzer
```

2. **Set up Python environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run FastAPI server**
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Run Streamlit app (alternative interface)**
```bash
streamlit run Home.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## 🌐 Access Points

- **FastAPI Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Streamlit App**: http://localhost:8501
- **React Frontend**: http://localhost:5173

## 📊 API Endpoints

### CAPM Calculator
- `POST /api/capm/calculate` - Calculate CAPM for selected stocks
- `GET /api/capm/available-stocks` - Get list of available stocks

### Stock Analysis
- `GET /api/analysis/{symbol}` - Get technical analysis for a stock
- `GET /api/analysis/{symbol}/indicators` - Get technical indicators

### Stock Prediction
- `POST /api/prediction/predict` - Generate price predictions
- `GET /api/prediction/model-info` - Get model information

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
# Optional: Add any API keys or configuration
YAHOO_FINANCE_API_KEY=your_key_here
```

### CORS Configuration
The FastAPI backend is configured to allow requests from:
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174
- http://127.0.0.1:3000
- http://127.0.0.1:5173

## 🧪 Development

### Backend Development
```bash
cd backend
# Run with auto-reload
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Run with hot reload
npm run dev
```

### Building for Production
```bash
cd frontend
npm run build
```

## 📈 Usage Examples

### CAPM Analysis
1. Select multiple stocks (e.g., TSLA, AAPL, MSFT)
2. Choose analysis period (1-10 years)
3. View calculated Beta values and expected returns
4. Compare normalized price movements

### Stock Prediction
1. Search for a stock by name or symbol
2. View 30-day price forecast
3. Analyze model accuracy (RMSE)
4. Compare predicted vs historical prices

### Technical Analysis
1. Enter stock symbol
2. Select time period (1D to Max)
3. View candlestick charts and indicators
4. Analyze volume and price trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Yahoo Finance for providing free financial data
- Streamlit and FastAPI communities for excellent frameworks
- React and Vite teams for modern frontend tooling

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Made with ❤️ by [Your Name]**
