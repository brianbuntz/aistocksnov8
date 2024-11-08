# AI Stocks Dashboard

An interactive dashboard for tracking AI-related stock performance.

## Setup

1. Clone this repository
2. Add your `stock_data.json` file to the root directory
3. Deploy to GitHub Pages or serve locally

## Data Format

The `stock_data.json` file should be an array of objects with the following structure:

```json
[
  {
    "Date": "2024-01-01",
    "Price_Apple (AAPL)": 123.45,
    "PercentChange_Apple (AAPL)": 1.23,
    "Price_Google (GOOGL)": 234.56,
    "PercentChange_Google (GOOGL)": 2.34,
    // ... other stocks
  }
]
```

## Local Development

To run locally:

```bash
# If you have Python installed
python -m http.server 8000

# If you have Node.js installed
npx serve
```

Then visit `http://localhost:8000` in your browser.

## Features

- Interactive stock selection
- Multiple time intervals
- Category filtering
- Search functionality
- Performance-based sorting
- Price/percentage toggle
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
