
/**
 * Calculates the Internal Rate of Return (IRR) for a series of cash flows.
 * Uses the Newton-Raphson method.
 * @param cashFlows Array of numbers where index 0 is Year 0 (usually negative).
 * @param guess Initial guess for IRR (default 0.1).
 * @returns IRR as a percentage (e.g., 15.5).
 */
export const calculateIRR = (cashFlows: number[], guess = 0.1): number => {
  const maxIterations = 1000;
  const tolerance = 0.000001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0; // Net Present Value
    let derivative = 0; // Derivative of NPV with respect to rate

    for (let j = 0; j < cashFlows.length; j++) {
      const denominator = Math.pow(1 + rate, j);
      npv += cashFlows[j] / denominator;
      
      if (j > 0) {
        // Derivative term: -j * Cj / (1+r)^(j+1)
        derivative -= (j * cashFlows[j]) / (denominator * (1 + rate));
      }
    }

    // Check for convergence
    if (Math.abs(npv) < tolerance) {
      return rate * 100;
    }

    // Avoid division by zero
    if (Math.abs(derivative) < tolerance) {
      return 0; 
    }

    // Newton-Raphson step
    const newRate = rate - npv / derivative;
    
    // Safety check for divergence
    if (Math.abs(newRate - rate) > 1) { 
        rate = rate * 0.5; // Dampen
    } else {
        rate = newRate;
    }
    
    if (rate <= -1) rate = -0.99; // Prevent invalid rates
  }

  return rate * 100;
};

/**
 * Calculates Loan-to-Value Ratio
 */
export const calculateLTV = (totalDebt: number, valuation: number): { ltv: number, riskLevel: 'Safe' | 'Moderate' | 'High' } => {
  if (valuation === 0) return { ltv: 0, riskLevel: 'Safe' };
  
  const ltv = (totalDebt / valuation) * 100;
  
  let riskLevel: 'Safe' | 'Moderate' | 'High' = 'Safe';
  if (ltv > 60) riskLevel = 'Moderate';
  if (ltv > 75) riskLevel = 'High';
  
  return { ltv, riskLevel };
};

/**
 * Calculates Weighted Average Cost of Capital (Simplistic)
 */
export const calculateWACC = (
  equityAmount: number, 
  equityCost: number, 
  debtAmount: number, 
  debtCost: number
): number => {
  const totalCapital = equityAmount + debtAmount;
  if (totalCapital === 0) return 0;
  
  const weightEquity = equityAmount / totalCapital;
  const weightDebt = debtAmount / totalCapital;
  
  return (weightEquity * equityCost) + (weightDebt * debtCost);
};
