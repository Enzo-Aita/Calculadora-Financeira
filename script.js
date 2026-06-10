// Alternar abas
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Formatação de moeda
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- Lógica de Financiamento ---
function calcularFinanciamento() {
    const pv = parseFloat(document.getElementById('fin-valor').value);
    const taxaMensal = parseFloat(document.getElementById('fin-taxa').value) / 100;
    const n = parseInt(document.getElementById('fin-tempo').value);
    const sistema = document.getElementById('fin-sistema').value;

    let parcelas = [];
    let totalPago = 0;
    let totalJuros = 0;

    if (sistema === 'PRICE') {
        // Fórmula PRICE: P = (PV * i) / (1 - (1 + i)^-n)
        const p = (pv * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -n));
        let saldoDevedor = pv;

        for (let i = 1; i <= n; i++) {
            const juros = saldoDevedor * taxaMensal;
            const amortizacao = p - juros;
            saldoDevedor -= amortizacao;
            if (saldoDevedor < 0) saldoDevedor = 0;

            parcelas.push({
                num: i,
                prestacao: p,
                juros: juros,
                amortizacao: amortizacao,
                saldo: saldoDevedor
            });
            totalPago += p;
            totalJuros += juros;
        }
    } else {
        // Fórmula SAC: A = PV / n; P = A + (Saldo Devedor * i)
        const amortizacaoFixa = pv / n;
        let saldoDevedor = pv;

        for (let i = 1; i <= n; i++) {
            const juros = saldoDevedor * taxaMensal;
            const p = amortizacaoFixa + juros;
            saldoDevedor -= amortizacaoFixa;
            if (saldoDevedor < 0) saldoDevedor = 0;

            parcelas.push({
                num: i,
                prestacao: p,
                juros: juros,
                amortizacao: amortizacaoFixa,
                saldo: saldoDevedor
            });
            totalPago += p;
            totalJuros += juros;
        }
    }

    // Atualizar Resumo
    document.getElementById('fin-resumo').innerHTML = `
        <div class="result-item">Total Pago: <span class="result-value">${formatCurrency(totalPago)}</span></div>
        <div class="result-item">Total de Juros: <span class="result-value">${formatCurrency(totalJuros)}</span></div>
        <div class="result-item">Primeira Parcela: <span class="result-value">${formatCurrency(parcelas[0].prestacao)}</span></div>
        <div class="result-item">Última Parcela: <span class="result-value">${formatCurrency(parcelas[n-1].prestacao)}</span></div>
    `;

    // Atualizar Tabela
    const tbody = document.querySelector('#fin-tabela tbody');
    tbody.innerHTML = '';
    parcelas.forEach(p => {
        const row = `<tr>
            <td>${p.num}</td>
            <td>${formatCurrency(p.prestacao)}</td>
            <td>${formatCurrency(p.juros)}</td>
            <td>${formatCurrency(p.amortizacao)}</td>
            <td>${formatCurrency(p.saldo)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

}

// --- Lógica de Juros Compostos ---
function calcularJuros() {
    const vp = parseFloat(document.getElementById('jur-presente').value);
    const aporte = parseFloat(document.getElementById('jur-aporte').value);
    const taxaMensal = parseFloat(document.getElementById('jur-taxa').value) / 100;
    const n = parseInt(document.getElementById('jur-tempo').value);

    let dados = [];
    let saldo = vp;
    let totalInvestido = vp;

    for (let i = 1; i <= n; i++) {
        const jurosNoMes = saldo * taxaMensal;
        saldo += jurosNoMes + aporte;
        totalInvestido += aporte;

        dados.push({
            mes: i,
            juros: jurosNoMes,
            aporte: aporte,
            investido: totalInvestido,
            saldo: saldo
        });
    }

    // Atualizar Resumo
    document.getElementById('jur-resumo').innerHTML = `
        <div class="result-item">Valor Total: <span class="result-value">${formatCurrency(saldo)}</span></div>
        <div class="result-item">Total Investido: <span class="result-value">${formatCurrency(totalInvestido)}</span></div>
        <div class="result-item">Total em Juros: <span class="result-value">${formatCurrency(saldo - totalInvestido)}</span></div>
    `;

    // Atualizar Tabela
    const tbody = document.querySelector('#jur-tabela tbody');
    tbody.innerHTML = '';
    dados.forEach(d => {
        const row = `<tr>
            <td>${d.mes}</td>
            <td>${formatCurrency(d.juros)}</td>
            <td>${formatCurrency(d.aporte)}</td>
            <td>${formatCurrency(d.investido)}</td>
            <td>${formatCurrency(d.saldo)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });


}

// --- Lógica de Prazo de Investimento ---
function calcularPrazo() {
    const inicial = parseFloat(document.getElementById('prz-inicial').value) || 0;
    const mensal = parseFloat(document.getElementById('prz-mensal').value) || 0;
    const selicAno = parseFloat(document.getElementById('prz-taxa').value) / 100;
    const tempo = parseInt(document.getElementById('prz-tempo').value) || 0;

    const taxaMensal = Math.pow(1 + selicAno, 1/12) - 1;
    let saldo = inicial;
    let historico = [{mes: 0, saldo: inicial}];

    for (let i = 1; i <= tempo; i++) {
        saldo = saldo * (1 + taxaMensal) + mensal;
        historico.push({mes: i, saldo: saldo});
    }

    const anos = Math.floor(tempo / 12);
    const mesesRestantes = tempo % 12;

    document.getElementById('prz-resumo').innerHTML = `
        <div class="result-item">Valor Final Acumulado: <span class="result-value">${formatCurrency(saldo)}</span></div>
        <div class="result-item">Tempo Total: <span class="result-value">${tempo} meses</span></div>
        <div class="result-item">Equivalente a: <span class="result-value">${anos} anos e ${mesesRestantes} meses</span></div>
        <div class="result-item">Total em Juros: <span class="result-value">${formatCurrency(saldo - (inicial + mensal * tempo))}</span></div>
    `;

    drawChart('prz-chart', historico.map(h => h.mes), historico.map(h => h.saldo), 'Evolução do Investimento');
}

// --- Função de Gráfico do Zero (Canvas) ---
function drawChart(canvasId, labels, data, title) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxVal = Math.max(...data) * 1.1;
    const minVal = 0;
    
    // Eixos
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Título
    ctx.fillStyle = '#1a237e';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 30);
    
    // Desenhar Linha
    ctx.beginPath();
    ctx.strokeStyle = '#aeea00';
    ctx.lineWidth = 3;
    
    data.forEach((val, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = (canvas.height - padding) - ((val - minVal) / (maxVal - minVal)) * chartHeight;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Pontos e Labels simplificados
    ctx.fillStyle = '#1a237e';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(maxVal), padding - 5, padding);
    ctx.fillText(formatCurrency(minVal), padding - 5, canvas.height - padding);
}

// Inicializar
window.onload = () => {
    calcularFinanciamento();
};
