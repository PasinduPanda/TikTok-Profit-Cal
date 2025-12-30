document.addEventListener('DOMContentLoaded', () => {
    // --- Tabs Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.calculator-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add to current
            tab.classList.add('active');
            const targetId = tab.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Calculation Logic ---

    // 1. Tiktok US Price
    const calcTiktokUS = () => {
        // Inputs
        const rmbCost = parseFloat(document.getElementById('us-product-cost').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('us-exchange-rate').value) || 7.0;
        const adsCostPercent = (parseFloat(document.getElementById('us-ads-cost').value) || 0) / 100;
        const affCostPercent = (parseFloat(document.getElementById('us-aff-cost').value) || 0) / 100;
        const firstFlight = parseFloat(document.getElementById('us-first-flight').value) || 0;
        const lastFlight = parseFloat(document.getElementById('us-last-flight').value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById('us-tiktok-fee').value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById('us-refund-rate').value) || 0) / 100;
        const profitMargin = (parseFloat(document.getElementById('us-profit-margin').value) || 0) / 100;

        // Calculations
        // Product+Shipping USD = (Product Cost RMB / Exchange) + First Flight + Last Flight
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;

        // Total Cost % = Ads + Aff + Tiktok + Refund + Profit
        // Note: In excel, Total % (K2) = F2+G2+H2+I2+J2
        // Excel Formula for Selling Price (L2) = E2 / (1 - K2)
        // Wait, check Excel formula again: L2 = E2 / (1 - K2)
        // Where K2 is the SUM of percentages including Profit Margin.
        // Let's verify K2 contents from previous thought:
        // K2 = F2+G2+H2+I2+J2  (Ads + Aff + Service + Refund + Profit)
        // If K2 = 61%, then Denominator = 1 - 0.61 = 0.39.
        // Wait, if K2 is "Total %", then L2 = Cost / (1 - Total%). That implies Total% is NOT "Total Cost" in usual sense, 
        // but the sum of all "margin-like" components taken from Selling Price.

        const sumPercentages = adsCostPercent + affCostPercent + tiktokFeePercent + refundPercent + profitMargin;

        let sellingPrice = 0;
        if (sumPercentages < 1) {
            sellingPrice = productShippingUSD / (1 - sumPercentages);
        }

        // Updates
        document.getElementById('us-result-shipping').textContent = `$${productShippingUSD.toFixed(2)}`;
        document.getElementById('us-result-cost-percent').textContent = `${(sumPercentages * 100).toFixed(2)}%`;
        document.getElementById('us-result-price').textContent = `$${sellingPrice.toFixed(2)}`;
    };

    // 2. Tiktok US Profit
    const calcTiktokUSProfit = () => {
        // Inputs
        const rmbCost = parseFloat(document.getElementById('us-p-product-cost').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('us-p-selling-price').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('us-p-exchange-rate').value) || 7.0;
        const adsCostPercent = (parseFloat(document.getElementById('us-p-ads-cost').value) || 0) / 100;
        const affCostPercent = (parseFloat(document.getElementById('us-p-aff-cost').value) || 0) / 100;
        const firstFlight = parseFloat(document.getElementById('us-p-first-flight').value) || 0;
        const lastFlight = parseFloat(document.getElementById('us-p-last-flight').value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById('us-p-tiktok-fee').value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById('us-p-refund-rate').value) || 0) / 100;

        // Calculations
        // Product+Shipping USD
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;

        // Product+Shipping Cost % (G2 in Excel) = P+S USD / Selling Price
        let shippingCostPercent = 0;
        if (sellingPrice > 0) {
            shippingCostPercent = productShippingUSD / sellingPrice;
        }

        // Profit Margin (L2) = 1 - G2 - H2 - I2 - J2 - K2
        // 1 - Cost% - Ads - Aff - Service - Refund
        const profitMargin = 1 - shippingCostPercent - adsCostPercent - affCostPercent - tiktokFeePercent - refundPercent;

        // Updates
        document.getElementById('us-p-result-shipping').textContent = `$${productShippingUSD.toFixed(2)}`;
        document.getElementById('us-p-result-shipping-percent').textContent = `${(shippingCostPercent * 100).toFixed(2)}%`;
        document.getElementById('us-p-result-margin').textContent = `${(profitMargin * 100).toFixed(2)}%`;

        // Add color for negative profit
        const marginEl = document.getElementById('us-p-result-margin');
        if (profitMargin < 0) {
            marginEl.style.webkitTextFillColor = '#ef4444'; // Red
            marginEl.style.background = 'none';
            marginEl.style.color = '#ef4444';
        } else {
            marginEl.style.webkitTextFillColor = 'transparent'; // Reset to gradient
            marginEl.style.background = '-webkit-linear-gradient(45deg, #ffffff, #e0e0e0)';
            marginEl.style.webkitBackgroundClip = 'text';
        }
    };

    // 3. Tiktok UK Price
    const calcTiktokUK = () => {
        // Inputs
        const rmbCost = parseFloat(document.getElementById('uk-product-cost').value) || 0;
        const exchangeRate = parseFloat(document.getElementById('uk-exchange-rate').value) || 9.0;
        const adsCostPercent = (parseFloat(document.getElementById('uk-ads-cost').value) || 0) / 100;
        const affCostPercent = (parseFloat(document.getElementById('uk-aff-cost').value) || 0) / 100;
        const shippingCost = parseFloat(document.getElementById('uk-shipping-cost').value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById('uk-tiktok-fee').value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById('uk-refund-rate').value) || 0) / 100;
        const profitMargin = (parseFloat(document.getElementById('uk-profit-margin').value) || 0) / 100;

        // Calculations
        // Product+Shipping GBP (D2) = (Product Cost / 9) + Shipping Cost
        const productShippingGBP = (rmbCost / exchangeRate) + shippingCost;

        // Total sum percentages (J2) = Ads + Aff + Service + Refund + Profit
        const sumPercentages = adsCostPercent + affCostPercent + tiktokFeePercent + refundPercent + profitMargin;

        // Selling Price (K2) = D2 / (1 - J2)
        let sellingPrice = 0;
        if (sumPercentages < 1) {
            sellingPrice = productShippingGBP / (1 - sumPercentages);
        }

        // Updates
        document.getElementById('uk-result-shipping').textContent = `£${productShippingGBP.toFixed(2)}`;
        document.getElementById('uk-result-cost-percent').textContent = `${(sumPercentages * 100).toFixed(2)}%`;
        document.getElementById('uk-result-price').textContent = `£${sellingPrice.toFixed(2)}`;
    }

    // Attach Listeners
    const inputsUS = document.querySelectorAll('#tiktok-us input');
    inputsUS.forEach(input => input.addEventListener('input', calcTiktokUS));

    const inputsUSProfit = document.querySelectorAll('#tiktok-us-profit input');
    inputsUSProfit.forEach(input => input.addEventListener('input', calcTiktokUSProfit));

    const inputsUK = document.querySelectorAll('#tiktok-uk input');
    inputsUK.forEach(input => input.addEventListener('input', calcTiktokUK));

    // Initial Calc
    calcTiktokUS();
    calcTiktokUSProfit();
    calcTiktokUK();
});
