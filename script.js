class CalculatorApp {
    constructor() {
        this.initTabs();

        // Initialize Calculators
        this.usPrice = new Calculator('tiktok-us', 'us', this.calcUSPrice.bind(this));
        this.usProfit = new Calculator('tiktok-us-profit', 'us-p', this.calcUSProfit.bind(this));
        this.ukPrice = new Calculator('tiktok-uk', 'uk', this.calcUKPrice.bind(this));

        // Shein Calculators
        this.sheinPrice = new Calculator('shein', 'shein', this.calcSheinPrice.bind(this));
        this.sheinProfit = new Calculator('shein-profit', 'shein-p', this.calcSheinProfit.bind(this));

        // Initial Rows
        this.usPrice.addRow();
        this.usProfit.addRow();
        this.ukPrice.addRow();
        this.sheinPrice.addRow();
        this.sheinProfit.addRow();

        // Add one more example row for them
        this.usPrice.addRow();
    }

    initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const sections = document.querySelectorAll('.calculator-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Global Settings Listener
        document.querySelectorAll('.settings-panel input').forEach(input => {
            input.addEventListener('input', () => {
                this.usPrice.recalculateAll();
                this.usProfit.recalculateAll();
                this.ukPrice.recalculateAll();
            });
        });
    }

    // --- Calculation Logic Handlers ---

    calcUSPrice(row, settings) {
        // Inputs
        const rmbCost = parseFloat(row.querySelector('.cost-input').value) || 0;
        const adsCostPercent = (parseFloat(row.querySelector('.ads-input').value) || 0) / 100;
        const affCostPercent = (parseFloat(row.querySelector('.aff-input').value) || 0) / 100;
        const profitMargin = (parseFloat(row.querySelector('.margin-input').value) || 0) / 100;

        // Global Inputs
        const exchangeRate = parseFloat(document.getElementById(`${settings}-exchange-rate`).value) || 7.0;
        const firstFlight = parseFloat(document.getElementById(`${settings}-first-flight`).value) || 0;
        const lastFlight = parseFloat(document.getElementById(`${settings}-last-flight`).value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById(`${settings}-tiktok-fee`).value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById(`${settings}-refund-rate`).value) || 0) / 100;

        // Logic
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;
        const sumPercentages = adsCostPercent + affCostPercent + tiktokFeePercent + refundPercent + profitMargin;

        let sellingPrice = 0;
        if (sumPercentages < 1) {
            sellingPrice = productShippingUSD / (1 - sumPercentages);
        }

        return {
            shipping: `$${productShippingUSD.toFixed(2)}`,
            mainResult: `$${sellingPrice.toFixed(2)}`
        };
    }

    calcUSProfit(row, settings) {
        // Inputs
        const rmbCost = parseFloat(row.querySelector('.cost-input').value) || 0;
        const sellingPrice = parseFloat(row.querySelector('.price-input').value) || 0;
        const adsCostPercent = (parseFloat(row.querySelector('.ads-input').value) || 0) / 100;
        const affCostPercent = (parseFloat(row.querySelector('.aff-input').value) || 0) / 100;

        // Global
        const exchangeRate = parseFloat(document.getElementById(`${settings}-exchange-rate`).value) || 7.0;
        const firstFlight = parseFloat(document.getElementById(`${settings}-first-flight`).value) || 0;
        const lastFlight = parseFloat(document.getElementById(`${settings}-last-flight`).value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById(`${settings}-tiktok-fee`).value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById(`${settings}-refund-rate`).value) || 0) / 100;

        // Logic
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;
        let shippingCostPercent = sellingPrice > 0 ? productShippingUSD / sellingPrice : 0;
        const profitMargin = 1 - shippingCostPercent - adsCostPercent - affCostPercent - tiktokFeePercent - refundPercent;

        return {
            shipping: `$${productShippingUSD.toFixed(2)}`,
            mainResult: `${(profitMargin * 100).toFixed(2)}%`,
            isPercent: true,
            val: profitMargin
        };
    }

    calcUKPrice(row, settings) {
        // Inputs
        const rmbCost = parseFloat(row.querySelector('.cost-input').value) || 0;
        const adsCostPercent = (parseFloat(row.querySelector('.ads-input').value) || 0) / 100;
        const affCostPercent = (parseFloat(row.querySelector('.aff-input').value) || 0) / 100;
        const profitMargin = (parseFloat(row.querySelector('.margin-input').value) || 0) / 100;

        // Global
        const exchangeRate = parseFloat(document.getElementById(`${settings}-exchange-rate`).value) || 9.0;
        const shippingCost = parseFloat(document.getElementById(`${settings}-shipping-cost`).value) || 0;
        const tiktokFeePercent = (parseFloat(document.getElementById(`${settings}-tiktok-fee`).value) || 0) / 100;
        const refundPercent = (parseFloat(document.getElementById(`${settings}-refund-rate`).value) || 0) / 100;

        // Logic
        const productShippingGBP = (rmbCost / exchangeRate) + shippingCost;
        const sumPercentages = adsCostPercent + affCostPercent + tiktokFeePercent + refundPercent + profitMargin;
        let sellingPrice = 0;
        if (sumPercentages < 1) {
            sellingPrice = productShippingGBP / (1 - sumPercentages);
        }

        return {
            shipping: `£${productShippingGBP.toFixed(2)}`,
            mainResult: `£${sellingPrice.toFixed(2)}`
        };
    }

    calcSheinPrice(row, settings) {
        // Inputs
        const rmbCost = parseFloat(row.querySelector('.cost-input').value) || 0;
        const profitMargin = (parseFloat(row.querySelector('.margin-input').value) || 0) / 100;

        // Global
        const exchangeRate = parseFloat(document.getElementById(`${settings}-exchange-rate`).value) || 7.0;
        const firstFlight = parseFloat(document.getElementById(`${settings}-first-flight`).value) || 0;
        const lastFlight = parseFloat(document.getElementById(`${settings}-last-flight`).value) || 0;
        const refundPercent = (parseFloat(document.getElementById(`${settings}-refund-rate`).value) || 0) / 100;

        // Logic
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;
        // Total % to deduct from 1 = Refund + Profit (no ads/aff/service fee in sheet)
        const sumPercentages = refundPercent + profitMargin;

        let sellingPrice = 0;
        if (sumPercentages < 1) {
            sellingPrice = productShippingUSD / (1 - sumPercentages);
        }

        return {
            shipping: `$${productShippingUSD.toFixed(2)}`,
            mainResult: `$${sellingPrice.toFixed(2)}`
        };
    }

    calcSheinProfit(row, settings) {
        // Inputs
        const rmbCost = parseFloat(row.querySelector('.cost-input').value) || 0;
        const sellingPrice = parseFloat(row.querySelector('.price-input').value) || 0;

        // Global
        const exchangeRate = parseFloat(document.getElementById(`${settings}-exchange-rate`).value) || 7.0;
        const firstFlight = parseFloat(document.getElementById(`${settings}-first-flight`).value) || 0;
        const lastFlight = parseFloat(document.getElementById(`${settings}-last-flight`).value) || 0;
        const refundPercent = (parseFloat(document.getElementById(`${settings}-refund-rate`).value) || 0) / 100;

        // Logic
        const productShippingUSD = (rmbCost / exchangeRate) + firstFlight + lastFlight;
        let shippingCostPercent = sellingPrice > 0 ? productShippingUSD / sellingPrice : 0;

        // Margin = 1 - Cost% - Refund%
        const profitMargin = 1 - shippingCostPercent - refundPercent;

        return {
            shipping: `$${productShippingUSD.toFixed(2)}`,
            mainResult: `${(profitMargin * 100).toFixed(2)}%`,
            isPercent: true,
            val: profitMargin
        };
    }
}

class Calculator {
    constructor(sectionId, settingsPrefix, calculationCallback) {
        this.tableBody = document.querySelector(`#${sectionId} tbody`);
        this.settingsPrefix = settingsPrefix;
        this.calcFn = calculationCallback;
    }

    addRow() {
        const tr = document.createElement('tr');

        // Define fields based on type
        // This is a bit dynamic but simple enough
        let html = '';
        if (this.settingsPrefix === 'us') { // US PRICE
            html = `
                <td><input type="number" class="cost-input" value="70" step="1"></td>
                <td><input type="number" class="ads-input" value="5.00" step="0.01"></td>
                <td><input type="number" class="aff-input" value="13.00" step="0.01"></td>
                <td><input type="number" class="margin-input" value="25.00" step="1"></td>
                <td class="res-shipping result-cell">-</td>
                <td class="res-main result-cell">-</td>
            `;
        } else if (this.settingsPrefix === 'us-p') { // US PROFIT
            html = `
                <td><input type="number" class="cost-input" value="69" step="1"></td>
                <td><input type="number" class="price-input" value="49.99" step="0.01"></td>
                <td><input type="number" class="ads-input" value="5.00" step="0.01"></td>
                <td><input type="number" class="aff-input" value="13.00" step="0.01"></td>
                 <td class="res-shipping result-cell">-</td>
                <td class="res-main result-cell">-</td>
            `;
        } else if (this.settingsPrefix === 'uk') { // UK PRICE
            html = `
                <td><input type="number" class="cost-input" value="70" step="1"></td>
                <td><input type="number" class="ads-input" value="0.00" step="0.01"></td>
                <td><input type="number" class="aff-input" value="0.00" step="0.01"></td>
                <td><input type="number" class="margin-input" value="40.00" step="1"></td>
                <td class="res-shipping result-cell">-</td>
                <td class="res-main result-cell">-</td>
            `;
        } else if (this.settingsPrefix === 'shein') { // SHEIN PRICE
            html = `
                <td><input type="number" class="cost-input" value="70" step="1"></td>
                <td><input type="number" class="margin-input" value="20.00" step="1"></td>
                <td class="res-shipping result-cell">-</td>
                <td class="res-main result-cell">-</td>
            `;
        } else if (this.settingsPrefix === 'shein-p') { // SHEIN PROFIT
            html = `
                <td><input type="number" class="cost-input" value="69" step="1"></td>
                <td><input type="number" class="price-input" value="49.99" step="0.01"></td>
                <td class="res-shipping result-cell">-</td>
                <td class="res-main result-cell">-</td>
            `;
        } else {
            console.error('Unknown settings prefix:', this.settingsPrefix);
            return; // Exit if no valid prefix
        }

        html += `
            <td>
                <button class="action-btn delete-row"><i class="ph ph-trash"></i></button>
            </td>
        `;

        tr.innerHTML = html;
        this.tableBody.appendChild(tr);

        // Bind events
        const inputs = tr.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => this.calculateRow(tr));
            // Add Paste Listener to EVERY input
            input.addEventListener('paste', (e) => this.handlePaste(e, tr, index));
        });

        tr.querySelector('.delete-row').addEventListener('click', () => {
            tr.remove();
        });

        // Run initial calc
        try {
            this.calculateRow(tr);
        } catch (err) {
            console.error('Error calculating row on init:', err);
        }
    }

    // --- NEW: Paste Handler implementation ---
    handlePaste(e, startRow, startColIndex) {
        e.preventDefault();
        const clipboardData = (e.clipboardData || window.clipboardData).getData('text');

        // Parse rows (newline)
        const rows = clipboardData.split(/\r\n|\n|\r/).filter(row => row.trim() !== '');

        let currentRow = startRow;

        rows.forEach((rowData, rowIndex) => {
            // Parse columns (tab)
            const cells = rowData.split('\t');

            // If we run out of rows, create new ones
            if (!currentRow) {
                this.addRow();
                // Getting the last added row
                currentRow = this.tableBody.lastElementChild;
            }

            // Get all inputs in this row
            const rowInputs = currentRow.querySelectorAll('input');

            cells.forEach((cellData, cellIndex) => {
                // Determine target input index 
                // We add startColIndex to handle pasting starting from middle columns
                const targetInputIndex = startColIndex + cellIndex;

                if (targetInputIndex < rowInputs.length) {
                    // Clean data (remove currency symbols, %, etc just in case)
                    let cleanValue = cellData.replace(/[$,£%]/g, '').trim();
                    // Basic number check
                    if (!isNaN(parseFloat(cleanValue))) {
                        rowInputs[targetInputIndex].value = cleanValue;
                    }
                }
            });

            // Recalculate this row
            this.calculateRow(currentRow);

            // Move to next row
            currentRow = currentRow.nextElementSibling;
        });
    }

    calculateRow(row) {
        const results = this.calcFn(row, this.settingsPrefix);
        row.querySelector('.res-shipping').textContent = results.shipping;

        const mainEl = row.querySelector('.res-main');
        mainEl.textContent = results.mainResult;

        if (results.isPercent) {
            mainEl.className = 'res-main result-cell'; // reset
            if (results.val < 0) mainEl.classList.add('profit-negative');
            else mainEl.classList.add('profit-positive');
        }
    }

    recalculateAll() {
        const rows = this.tableBody.querySelectorAll('tr');
        rows.forEach(row => this.calculateRow(row));
    }
}

// Init App
const app = new CalculatorApp();
