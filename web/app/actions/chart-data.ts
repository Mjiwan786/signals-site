'use server'

export interface ChartData {
  time: number
  value: number
}

export interface ChartInfo {
  symbol: string
  data: ChartData[]
  change: number
  changePercent: number
}

export async function getChartData(): Promise<ChartInfo[]> {
  // Simulate API call with some delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Generate mock data for 3 charts
  const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
  const charts: ChartInfo[] = []
  
  for (const symbol of symbols) {
    const data: ChartData[] = []
    const now = Date.now()
    const basePrice = symbol === 'BTC/USDT' ? 45000 : symbol === 'ETH/USDT' ? 3000 : 100
    
    // Generate 100 data points over the last 24 hours
    for (let i = 0; i < 100; i++) {
      const time = now - (100 - i) * 14.4 * 60 * 1000 // 14.4 minutes between points
      const randomChange = (Math.random() - 0.5) * 0.02 // ±1% random change
      const value = basePrice * (1 + randomChange + (i * 0.001)) // Slight upward trend
      
      data.push({
        time: Math.floor(time / 1000), // Convert to seconds
        value: Math.round(value * 100) / 100
      })
    }
    
    const latestPrice = data[data.length - 1].value
    const previousPrice = data[data.length - 2].value
    const change = latestPrice - previousPrice
    const changePercent = (change / previousPrice) * 100
    
    charts.push({
      symbol,
      data,
      change,
      changePercent
    })
  }
  
  return charts
}



