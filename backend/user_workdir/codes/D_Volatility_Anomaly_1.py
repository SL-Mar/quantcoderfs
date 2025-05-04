from AlgorithmImports import *
import numpy as np

class VolatilityAnomalyAlgorithm(QCAlgorithm):
    def Initialize(self):
        self.SetStartDate(2015, 1, 1)  # Set start date
        self.SetEndDate(2023, 1, 1)    # Set end date
        self.SetCash(100000)  # Set Strategy Cash
        self.rebalance_time = datetime.min
        
        self.data = {}
        self.low_volatility_stocks = []
        self.high_volatility_stocks = []

        self.AddUniverse(self.CoarseSelectionFunction)
        self.Schedule.On(self.DateRules.MonthStart(), self.TimeRules.At(0, 0), self.Rebalance)

    def CoarseSelectionFunction(self, coarse):
        selected = [x for x in coarse if x.HasFundamentalData and x.Price > 10]
        
        # Sort stocks by dollar volume, take top 1000
        sorted_by_dollar_volume = sorted(selected, key=lambda x: x.DollarVolume, reverse=True)[:1000]
        return [x.Symbol for x in sorted_by_dollar_volume]

    def OnSecuritiesChanged(self, changes):
        for security in changes.RemovedSecurities:
            if security.Symbol in self.data:
                del self.data[security.Symbol]

        for security in changes.AddedSecurities:
            history = self.History([security.Symbol], 252, Resolution.Daily).close
            if not history.empty:
                self.data[security.Symbol] = history

    def Rebalance(self):
        if self.Time < self.rebalance_time:
            return

        volatilities = {}
        for symbol, prices in self.data.items():
            daily_returns = prices.pct_change().dropna()
            volatilities[symbol] = daily_returns.std()

        # Sort symbols into two groups: high and low volatility
        sorted_symbols = sorted(volatilities, key=volatilities.get)
        midpoint = len(sorted_symbols) // 2
        self.low_volatility_stocks = sorted_symbols[:midpoint]
        self.high_volatility_stocks = sorted_symbols[midpoint:]
        
        low_weight = 0.7
        high_weight = 0.3

        self.SetHoldings({symbol: low_weight / len(self.low_volatility_stocks) for symbol in self.low_volatility_stocks})
        self.SetHoldings({symbol: high_weight / len(self.high_volatility_stocks) for symbol in self.high_volatility_stocks})

        self.rebalance_time = self.Time + timedelta(30)

    def OnData(self, data):
        pass  # All logic is in rebalance method
