from AlgorithmImports import *

class BShortTermReversal(QCAlgorithm):
    def Initialize(self):
        self.SetStartDate(2022, 1, 1)
        self.SetEndDate(2023, 1, 1)
        self.SetCash(100000)
        
        # Universe selection: Focusing on the largest market cap stocks (e.g., S&P 500)
        self.UniverseSettings.Resolution = Resolution.Daily
        self.AddUniverse(self.CoarseSelectionFunction)

        # Indicators
        self.reversal_window = 5  # Lookback window for reversal
        self.reversal_threshold = 0.005  # 50 basis points threshold

    def CoarseSelectionFunction(self, coarse):
        sortedByDollarVolume = sorted([x for x in coarse if x.HasFundamentalData],
                                      key=lambda x: x.DollarVolume, reverse=True)
        return [x.Symbol for x in sortedByDollarVolume[:500]]  # Largest 500 stocks

    def OnData(self, data):
        if not self.Portfolio.Invested:
            for symbol in data.Bars.Keys:
                history = self.History([symbol], self.reversal_window, Resolution.Daily)
                if len(history) < self.reversal_window:
                    continue
                closes = history[symbol].close
                # Calculate price reversal
                returns = closes[-1] / closes[0] - 1
                if returns < -self.reversal_threshold:  # Market overreaction
                    self.SetHoldings(symbol, 0.02)  # Position sizing constraint

    def OnOrderEvent(self, orderEvent):
        if orderEvent.Status == OrderStatus.Filled:
            self.Debug(f"Order filled for {orderEvent.Symbol} - {orderEvent.Direction}")
