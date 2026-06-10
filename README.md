# Calculadora-Financeira

Documentação Técnica — Calculadora Financeira A3 

Projeto: Matemática Computacional Aplicada Arquivos: index.html, script.js, style.css 

 

# index.html 

Estrutura a interface da aplicação em três partes principais: 

➞Cabeçalho "(<header>)": Exibe o título e subtítulo do projeto com fundo azul. 

➞Navegação por abas  (nav class="tabs"): Três botões que alternam entre as seções. Cada botão chama openTab() passando o id da seção correspondente. O primeiro botão começa com a classe active. 

➞Seções de conteúdo  (<section class="tab-content">): Cada seção segue o mesmo padrão — um card com formulário de entrada, um card de resumo de resultados e uma tabela analítica. Todas começam ocultas exceto #financiamento. Os ids dos campos (ex: fin-valor, jur-taxa) são usados pelo JavaScript para ler os valores digitados. 

Rodapé (<footer>): Texto de copyright do projeto. 

O arquivo script.js é carregado no final do <body> para garantir que todos os elementos existam antes de o JavaScript tentar acessá-los. 

 

# script.js 

Navegação por abas — openTab(tabId) 

Remove a classe active de todas as seções e botões, depois adiciona active apenas na seção com o id recebido e no botão clicado. O CSS usa essa classe para mostrar/esconder as seções. 

Formatação de moeda — formatCurrency(value) 

Converte um número para o formato de moeda brasileira usando toLocaleString('pt-BR'). Usada em toda a aplicação para exibir valores como R$ 1.500,00. 

Financiamento — calcularFinanciamento() 

Lê os campos de entrada (valor, taxa, prazo, sistema) e calcula a tabela de amortização conforme o sistema escolhido. 

Sistema PRICE: A prestação é fixa e calculada pela fórmula: 

P = (PV × i) / (1 − (1 + i)^−n) 

A cada mês, os juros incidem sobre o saldo devedor atual. A amortização é a diferença entre a prestação e os juros, crescendo ao longo do tempo. 

Sistema SAC: A amortização é fixa (PV ÷ n). Os juros incidem sobre o saldo devedor, que diminui uniformemente. Por isso a prestação decresce a cada mês. 

Ao final, atualiza o resumo (total pago, total de juros, primeira e última parcela) e preenche a tabela analítica com uma linha por mês. 

Juros Compostos — calcularJuros() 

Simula o crescimento de um investimento com aporte mensal. A cada mês calcula os juros sobre o saldo atual, adiciona os juros e o aporte, e acumula o total investido. Exibe o valor final, total investido, total em juros e preenche a tabela mês a mês. 

Prazo de Investimento — calcularPrazo() 

Converte a taxa Selic anual para mensal usando juros equivalentes: 

i_mensal = (1 + i_anual)^(1/12) − 1 

Simula mês a mês o saldo acumulado aplicando rendimento e somando o aporte mensal. Exibe o valor final acumulado, o tempo em anos e meses e o total gerado em juros. 

# style.css 

Variáveis de tema (:root) 

Define as cores globais da aplicação. --primary-color (#1a237e) é o azul escuro usado no cabeçalho, botões e tabelas. --secondary-color (#aeea00) é o verde-limão usado como destaque na borda dos cards de resultado e na linha do gráfico. 

Layout 

.container: Limita o conteúdo a 1000px e centraliza na tela. 

.grid: Divide formulário e card de resultado em duas colunas lado a lado. Em telas menores que 768px (via @media), as colunas se empilham em uma única coluna. 

Abas 

.tab-content: Todas as seções ficam ocultas por padrão (display: none). Apenas a que tem a classe .active fica visível (display: block). 

.tab-btn.active: Aplica fundo azul e texto branco ao botão da aba selecionada. Os demais ficam cinza. 

Cards 

.card: Fundo branco com sombra suave, criando a aparência de painel elevado. 

.result-card: Adiciona uma borda verde-limão de 5px à esquerda, diferenciando o card de resultados do card de formulário. 

Tabelas 

th (cabeçalho): Fundo azul escuro, texto branco e position: sticky para o cabeçalho ficar fixo ao rolar. 

tr:nth-child(even): Aplica fundo cinza claro nas linhas pares, criando o efeito zebra. 

.scroll-table: Limita a altura a 400px e ativa rolagem vertical quando há mais linhas do que o espaço comporta. 

Botão 

.btn: Azul escuro, largura total do card. Ao passar o mouse (:hover), o tom de azul muda levemente para dar feedback visual. 
