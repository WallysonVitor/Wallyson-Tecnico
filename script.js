// Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Número de WhatsApp do Wallyson (formato internacional, sem espaços)
const WHATSAPP_NUMERO = "5585994539446";

// Envia o formulário de contato como mensagem pronta no WhatsApp
const form = document.getElementById("contact-form");
const nota = document.getElementById("form-note");

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const problema = document.getElementById("problema").value.trim();

  if (!nome || !problema) {
    nota.textContent = "Preencha nome e o problema antes de enviar.";
    nota.style.color = "#E8734D";
    return;
  }

  const mensagem =
    `Olá, Wallyson! Meu nome é ${nome}.\n` +
    `Problema no meu equipamento: ${problema}`;

  const link = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

  nota.textContent = "Abrindo o WhatsApp...";
  nota.style.color = "#4FA37D";

  window.open(link, "_blank", "noopener");
  form.reset();
});

// ---------- Diagnóstico rápido ----------
// Regras simples por palavra-chave: não é uma IA analisando o caso de
// verdade, é um palpite inicial pra dar direção e uma faixa de preço.
// O diagnóstico e o valor final sempre são confirmados por mensagem.
const REGRAS_DIAGNOSTICO = [
  {
    palavras: ["nao liga", "não liga", "nao ligar", "desligou sozinho", "nao acende", "não acende", "morreu"],
    diagnostico: "Possível problema na fonte de alimentação ou na placa-mãe. Também pode ser bateria/carregador, no caso de notebook.",
    preco: "R$ 80 a R$ 250 (diagnóstico + mão de obra; peça à parte, se precisar trocar)"
  },
  {
    palavras: ["lento", "lenta", "travando", "trava muito", "demora pra abrir", "muito devagar"],
    diagnostico: "Provavelmente HD/SSD sobrecarregado, excesso de programas rodando junto ou sinais de vírus.",
    preco: "R$ 100 a R$ 180 (limpeza e otimização do sistema)"
  },
  {
    palavras: ["tela azul", "bsod", "reinicia sozinho", "reiniciando sozinho"],
    diagnostico: "Costuma ser memória RAM com defeito, driver corrompido ou superaquecimento.",
    preco: "R$ 80 a R$ 200 (diagnóstico; troca de peça à parte, se necessário)"
  },
  {
    palavras: ["sem imagem", "tela preta", "nao da imagem", "não dá imagem", "sem video", "sem vídeo"],
    diagnostico: "Pode ser cabo de vídeo, placa de vídeo ou monitor. Precisa de teste com outro equipamento para confirmar.",
    preco: "R$ 100 a R$ 300 (varia bastante conforme a causa)"
  },
  {
    palavras: ["barulho", "barulho estranho", "ventoinha", "fazendo barulho", "cooler"],
    diagnostico: "Ventoinha suja, com folga ou mancal gasto — é o motivo mais comum de barulho.",
    preco: "R$ 80 a R$ 150 (limpeza interna e revisão do cooler)"
  },
  {
    palavras: ["esquentando", "esquenta muito", "superaquecendo", "muito quente"],
    diagnostico: "Acúmulo de poeira e pasta térmica ressecada, reduzindo a troca de calor do processador.",
    preco: "R$ 80 a R$ 150 (limpeza interna e pasta térmica nova)"
  },
  {
    palavras: ["sem internet", "wifi nao conecta", "wifi não conecta", "rede nao funciona", "rede não funciona", "sem sinal"],
    diagnostico: "Pode ser configuração de rede, driver de Wi-Fi desatualizado ou o próprio roteador.",
    preco: "R$ 60 a R$ 120 (diagnóstico e configuração de rede)"
  },
  {
    palavras: ["virus", "vírus", "popup", "propaganda abrindo", "anuncio abrindo", "anúncio abrindo"],
    diagnostico: "Sinais de vírus ou programa indesejado instalado junto com algum outro software.",
    preco: "R$ 80 a R$ 150 (remoção de vírus e limpeza do sistema)"
  },
  {
    palavras: ["pendrive nao aparece", "pendrive não aparece", "usb nao funciona", "usb não funciona"],
    diagnostico: "Geralmente é driver de USB desatualizado ou porta com mau contato.",
    preco: "R$ 60 a R$ 120 (diagnóstico e configuração)"
  },
  {
    palavras: ["teclado nao funciona", "teclado não funciona", "tecla nao funciona", "tecla não funciona", "teclado travando"],
    diagnostico: "Pode ser sujeira sob as teclas ou o teclado com defeito, precisando de troca.",
    preco: "R$ 80 a R$ 200 (limpeza ou troca de teclado, conforme o caso)"
  },
  {
    palavras: ["tela quebrada", "tela trincada", "caiu e quebrou", "quebrou a tela", "trinca na tela"],
    diagnostico: "Dano físico na tela — o painel provavelmente precisa ser substituído.",
    preco: "R$ 250 a R$ 600 (varia conforme o modelo do notebook)"
  }
];

const DIAGNOSTICO_PADRAO = {
  diagnostico: "Não consegui identificar uma causa clara só pela descrição — pode ser mais de uma coisa junto. Vale um diagnóstico presencial pra saber com certeza.",
  preco: "R$ 60 a R$ 100 (valor do diagnóstico presencial, abatido do serviço se você aprovar)"
};

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function analisarProblema(descricaoOriginal) {
  const textoNormalizado = normalizarTexto(descricaoOriginal);
  let melhorRegra = null;
  let melhorPontuacao = 0;

  REGRAS_DIAGNOSTICO.forEach(function (regra) {
    let pontuacao = 0;
    regra.palavras.forEach(function (palavraChave) {
      if (textoNormalizado.includes(normalizarTexto(palavraChave))) {
        pontuacao += 1;
      }
    });
    if (pontuacao > melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhorRegra = regra;
    }
  });

  return melhorRegra || DIAGNOSTICO_PADRAO;
}

const diagForm = document.getElementById("diag-form");
const diagFormNote = document.getElementById("diag-form-note");
const diagResult = document.getElementById("diag-result");

if (diagForm) {
  diagForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campoDescricao = document.getElementById("diag-input");
    const descricao = campoDescricao.value.trim();

    if (!descricao) {
      diagFormNote.textContent = "Descreva o problema pra eu poder analisar.";
      diagFormNote.style.color = "#E8734D";
      return;
    }

    diagFormNote.textContent = "";

    const resultado = analisarProblema(descricao);

    document.getElementById("res-problema").textContent = descricao;
    document.getElementById("res-diagnostico").textContent = resultado.diagnostico;
    document.getElementById("res-preco").textContent = resultado.preco;

    const mensagemWhatsapp =
      "Olá, Wallyson! Usei o diagnóstico rápido do site.\n\n" +
      "Problema relatado: " + descricao + "\n\n" +
      "Diagnóstico sugerido pelo site: " + resultado.diagnostico + "\n" +
      "Orçamento estimado: " + resultado.preco + "\n\n" +
      "Pode confirmar pra mim?";

    const linkWhatsapp = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(mensagemWhatsapp);
    document.getElementById("res-whatsapp").setAttribute("href", linkWhatsapp);

    diagResult.hidden = false;
    diagResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
document.querySelectorAll('.main-nav a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (evento) {
    const destinoId = link.getAttribute("href").slice(1);
    const destino = document.getElementById(destinoId);
    if (destino) {
      evento.preventDefault();
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
      destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    }
  });
});
