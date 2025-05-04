from AlgorithmImports import *

class ShortTermReversalAlgorithm(QCAlgorithm):
    def Initialize(self):
        self.SetStartDate(2015, 1, 1)  # Set Start Date
        self.SetEndDate(2020, 1, 1)    # Set End Date
        self.SetCash(100000)           # Set Strategy Cash
        self.rebalanceDays = 5
        self.AddUniverse(self.CoarseSelectionFunction)
        self.AddAlpha(ReversalAlphaModel(self.rebalanceDays))
        self.SetPortfolioConstruction(EqualWeightingPortfolioConstructionModel())
        self.SetExecution(ImmediateExecutionModel())
        self.SetRiskManagement(MaximumDrawdownPercentPerSecurity(0.04))

    def CoarseSelectionFunction(self, coarse):
        # Sort stocks by daily dollar volume and take top 1000
        sortedByDollarVolume = sorted(coarse, key=lambda x: x.DollarVolume, reverse=True)
        return [x.Symbol for x in sortedByDollarVolume[:1000]]

class ReversalAlphaModel(AlphaModel):
    def __init__(self, rebalanceDays):
        self.rebalanceDays = rebalanceDays

    def Update(self, algorithm, data):
        insights = []
        for symbol in data.Keys:
            currentPrice = data[symbol].Price
            history = algorithm.History(symbol, 2, Resolution.Daily)
            if len(history) < 2:
                continue

            previousPrice = history['close'].iloc[-2]
            # Generate long signal for previous losers and short for winners
            if currentPrice < previousPrice:
                insights.append(Insight.Price(symbol, timedelta(days=self.rebalanceDays), InsightDirection.Up))
            else:
                insights.append(Insight.Price(symbol, timedelta(days=self.rebalanceDays), InsightDirection.Down))

        return insights

class ImmediateExecutionModel(ExecutionModel):
    def Execute(self, algorithm, targets):
        for target in targets:
            # Set holdings to target percentage, not to a sum of quantities
            algorithm.SetHoldings(target.Symbol, target.Quantity / algorithm.Portfolio.TotalPortfolioValue)

class MaximumDrawdownPercentPerSecurity(RiskManagementModel):
    '''Handles drawdown per security''' 
    def __init__(self, drawdown):
        self.maximumDrawdown = drawdown

    def ManageRisk(self, algorithm, targets):
        for kvp in algorithm.Portfolio:
            symbol = kvp.Key
            security = kvp.Value

            # Calculate the percentage drawdown
            highWatermark = security.High
            drawdown = (highWatermark - security.Price) / highWatermark

            # Check if drawdown exceeds threshold
            if drawdown > self.maximumDrawdown:
                targets.append(PortfolioTarget(symbol, 0))

        return targets
