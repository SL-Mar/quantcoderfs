from AlgorithmImports import *

class ShortTermReversalStrategy(QCAlgorithm):
    def Initialize(self):
        self.SetStartDate(2022, 1, 1)
        self.SetEndDate(2023, 1, 1)
        self.SetCash(100000)

        # Define universe: Large Cap, Mid Cap, Small Cap
        self.UniverseSettings.Resolution = Resolution.Daily
        self.AddUniverse(self.CoarseSelectionFunction)

        # Models for trading cost: Keim and Madhavan (simplified)
        self.tradingCostModel = KeimAndMadhavanTradingCostModel()

        # Reversal strategy parameters
        self.rebalancingInterval = 30 # Rebalance every 30 days
        self.reversalLookBack = 5 # Look back period for reversal
        self.nextRebalance = self.Time

    def CoarseSelectionFunction(self, coarse):
        sortedByDollarVolume = sorted(coarse, key=lambda x: x.DollarVolume, reverse=True)
        universe = [x.Symbol for x in sortedByDollarVolume if x.HasFundamentalData][:100]
        return universe

    def OnData(self, data):
        if self.Time < self.nextRebalance:
            return
        self.nextRebalance = self.Time + timedelta(days=self.rebalancingInterval)

        changes = [security.Symbol for security in self.Portfolio.Values]
        for security in self.Portfolio.Values:
            if security.Invested:
                self.Liquidate(security.Symbol)

        insights = []
        for symbol in changes:
            if data.Bars.ContainsKey(symbol):
                # Compute reversal signal
                history = self.History(symbol, self.reversalLookBack, Resolution.Daily)
                if not history.empty:
                    close_prices = history.loc[symbol].close
                    rev_signal = close_prices.iloc[-1] < close_prices.iloc[0]
                    if rev_signal:
                        insights.append(Insight.Price(symbol, timedelta(days=1), InsightDirection.Up))

        if insights:            
            self.SetHoldings(insights)

    def SetHoldings(self, insights):
        for insight in insights:
            self.SetHoldings(insight.Symbol, 1/len(insights))

# Simplified trading cost model
class KeimAndMadhavanTradingCostModel(ITradingCostModel):
    def GetTradingCost(self, security, order):
        volumeImpact = 0.0015 # assumed impact
        fixedCost = 0.002 # assumed cost from Nomura
        return fixedCost + volumeImpact * order.AbsoluteQuantity