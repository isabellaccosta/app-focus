/* =====================================================================
   FOCO · data.js — conteúdo do "Plano de Estudos Estratégico"
   (posição de 28/09/2026). Edite aqui para atualizar datas e textos.
   nivel: 1 = fácil · 2 = média · 3 = difícil
   ===================================================================== */
window.DATA = {

  /* ---------- PROVAS ---------- */
  provas: [
    { id: 'inteli', nome: 'Inteli', curso: 'Engenharia de Software', data: '2026-10-18', hora: 'Online 9h–11h ou presencial 14h30–16h30',
      insc: 'Até 05/10 · taxa R$ 300 · isenção venceu 28/09', nivel: 3,
      info: ['Etapa eliminatória adaptativa: 20 questões em até 2 h, 4 níveis de dificuldade.',
             'O começo da prova calibra o resto: entre focado.',
             'Conteúdo: combinatória, geometria (plana, espacial, analítica), lógica e sequências (PA/PG).',
             'Depois: Eixo Perfil (2 redações pessoais) e Eixo Projeto (dinâmica em grupo).',
             'Resultado previsto: 03/12 (uma página ainda mostra 10/12; confirme).',
             'Formato e bolsa são escolhidos na inscrição.'] },
    { id: 'fiap', nome: 'FIAP', curso: 'ADS (EAD)', data: '2026-11-07', hora: 'Sábado, 10h · online · 3 h',
      insc: 'Até 05/11 · taxa R$ 90', nivel: 2,
      info: ['Redação + interpretação, raciocínio lógico e matemática, sem calculadora.',
             'Corte: 50% na prova toda e 50% na redação. Redação fraca reprova.',
             'Só pode entregar depois de 1 h. Reserve 70 min para a redação.'] },
    { id: 'enem1', nome: 'ENEM · dia 1', curso: 'Linguagens, Humanas e Redação', data: '2026-11-08', hora: 'Portões 12h–13h · prova 13h30–19h',
      insc: 'Inscrição já feita (confirme no seu comprovante)', nivel: 3,
      info: ['Redação vai de 0 a 1000 (5 competências de 200).', 'Seu seguro para Sisu, Prouni e Fies.'] },
    { id: 'enem2', nome: 'ENEM · dia 2', curso: 'Matemática e Natureza', data: '2026-11-15', hora: 'Portões 12h–13h · prova 13h30–18h30',
      insc: 'Mesma inscrição do dia 1', nivel: 3,
      info: ['90 questões em 5 h (cerca de 3,3 min cada).', 'Faça 3 passadas: fáceis, médias, difíceis.'] },
    { id: 'mack', nome: 'Mackenzie', curso: 'Ciência da Computação · Grupo 2', data: '2026-11-26', hora: 'Quinta, 13h',
      insc: 'Até 11/11 · taxa dobra depois de 28/10 (ciclo anterior)', nivel: 3,
      info: ['Redação (peso 4), Português, Física, Química e Matemática (peso 3).',
             'Nota zero em Redação, Português ou Matemática desclassifica.',
             'Salas no Portal do Candidato em 23/11, depois das 16h.'] },
    { id: 'imt', nome: 'IMT / Mauá', curso: 'ADS ou Ciência da Computação', data: '2026-11-28', hora: 'Sábado, 9h · 3 h',
      insc: 'Até 25/11 · plano B online em 08/12, 15h', nivel: 2,
      info: ['Redação + 46 questões na matriz do ENEM.', 'Use 45–50 min para a redação e cerca de 2 h para as questões.'] },
    { id: 'uscs', nome: 'USCS', curso: 'Ciência da Computação', data: '2026-12-05', hora: 'Redação online · data a confirmar',
      insc: 'Taxa de R$ 40 (ciclos anteriores)', nivel: 1,
      info: ['Prova só de redação, provavelmente na 1ª semana de dezembro.', 'Confirme no site oficial: o edital geral não foi localizado.'] }
  ],

  next48: ['Fazer a inscrição no Inteli (até 05/10).', 'Baixar o edital e o Anexo II do Inteli.',
           'Diagnóstico: 30 questões de matemática, 10 de lógica e 1 redação.', 'Criar o caderno de erros (aba Erros).',
           'Bloquear na agenda os três blocos diários (aba Rotina).'],

  /* ---------- FASES ---------- */
  fases: [
    { id: 1, nome: 'Fase 1 · Passar no corte do Inteli', ini: '2026-09-28', fim: '2026-10-18', foco: 'Reconstruir a base de exatas.',
      semanas: [
        ['S1 · 28/09–04/10', 'Diagnóstico; frações, porcentagem, razão, regra de três; equação de 1º grau; lógica de sequências. Redação: esqueleto + 1 texto (IA e trabalho).'],
        ['S2 · 05/10–11/10', 'Equação de 2º grau, funções, PA/PG, combinatória; conectivos e Venn. Redação: 2 textos e início do banco de histórias do Perfil.'],
        ['S3 · 12/10–18/10', 'Probabilidade, geometria plana e espacial; 2 simulados de 20 questões em 2 h. Últimas 48 h: só caderno de erros e sono.']] },
    { id: 2, nome: 'Fase 2 · FIAP e ENEM', ini: '2026-10-19', fim: '2026-11-15', foco: 'Matemática aplicada, Física e redação ENEM.',
      semanas: [
        ['S4 · 19/10–25/10', 'ENEM I: razão, juros, estatística, gráficos; Newton e energia. Se passar no Inteli: enviar o Perfil.'],
        ['S5 · 26/10–01/11', 'ENEM II: funções, geometria espacial, probabilidade; eletrodinâmica e termologia. Dinâmica do Inteli Projeto.'],
        ['S6 · 02/11–08/11', 'Simulado FIAP-like (3 h, sem calculadora); simulado ENEM dia 1. FIAP sáb 07/11 · ENEM dom 08/11.'],
        ['S7 · 09/11–15/11', 'Top temas de Matemática e Natureza; maratona de 45 questões. Inscrever no Mackenzie até 11/11. ENEM dia 2 em 15/11.']] },
    { id: 3, nome: 'Fase 3 · Mackenzie, IMT e USCS', ini: '2026-11-16', fim: '2026-12-06', foco: 'Matéria completa, simulados e redação.',
      semanas: [
        ['S8 · 16/11–22/11', 'Simulado Mackenzie-like (60 questões + redação) e IMT-like (46 + redação); rodízio de Português, Inglês, Geografia, História, Bio e Quím.'],
        ['S9 · 23/11–29/11', 'Conferir locais de prova. Mini simulado, erros e fórmulas. Mackenzie 26/11 · IMT 28/11.'],
        ['S10 · 30/11–06/12', 'Manutenção de 1 h/dia; 2 textos para a USCS. Inteli: resultado em 03/12.']] }
  ],

  estagio: [
    { t: 'S1–S5 · 3 h por semana', d: 'Pseudocódigo e fluxograma, Python (variáveis e condicionais), laços e listas, funções e strings, busca e ordenação, dicionários e recursão. Resolva no papel antes de codar; 10–15 exercícios por semana (Beecrowd, HackerRank, Exercism). Curso em Vídeo cobre o básico.' },
    { t: 'S6–S10 · manutenção', d: '2 × 45 min por semana.' },
    { t: 'Dezembro', d: 'Python sólido e lógica de testes (1–1,5 h/dia).' },
    { t: 'Janeiro', d: 'Estruturas de dados básicas, SQL básico, Git e testes cronometrados de processos seletivos.' },
    { t: 'Fevereiro', d: 'Entrevistas simuladas e 2–3 mini projetos no GitHub.' }
  ],

  /* ---------- ROTINA (0 = domingo) ---------- */
  rotina: {
    1: [b('seg1', '14h–16h', '2 h', 'Matemática: tópico novo', 'mat', 'Teoria, exemplos e questões.'), b('seg2', '16h20–17h50', '1h30', 'Redação: planejar o texto da semana', 'red', 'Tema, tese, repertório e esqueleto.'), b('seg3', '19h30–21h', '1h30', 'Programação e lógica', 'prog', 'Papel primeiro, código depois.')],
    2: [b('ter1', '14h–16h', '2 h', 'Física: tópico novo', 'fis', 'Sempre com unidade na conta.'), b('ter2', '16h20–17h50', '1h30', 'Raciocínio lógico cronometrado', 'log', 'Padrões, conectivos, associação.'), b('ter3', '19h30–21h', '1h30', 'Português / interpretação + Inglês', 'port', 'Leitura ativa e gramática.')],
    3: [b('qua1', '14h–16h', '2 h', 'Matemática: questões graduadas', 'mat', 'Do tópico de segunda.'), b('qua2', '16h20–17h50', '1h30', 'Redação: texto cronometrado', 'red', '60 min escrevendo + 30 min de autocorreção.'), b('qua3', '19h30–21h', '1h30', 'Programação e lógica', 'prog', 'Exercícios da semana.')],
    4: [b('qui1', '14h–16h', '2 h', 'Física: questões (Fase 1: Matemática)', 'fis', 'Na Fase 1 este bloco vira Matemática.'), b('qui2', '16h20–17h50', '1h30', 'Raciocínio lógico: problemas do dia', 'log', 'Verdade/mentira e tabelas.'), b('qui3', '19h30–21h', '1h30', 'Humanas, Bio ou Quím (rodízio)', 'hum', 'Por questões. Na Fase 1: só Português e Inglês.')],
    5: [b('sex1', '14h–16h', '2 h', 'Matemática: lista mista + revisão', 'mat', 'Revisão espaçada D+1, D+7, D+21.'), b('sex2', '16h20–17h50', '1h30', 'Redação: reescrever o texto de quarta', 'red', 'Aplique a autocorreção.'), b('sex3', '19h30–21h', '1h30', 'Revisão do caderno de erros', 'mat', 'Refaça sem olhar a resposta.')],
    6: [b('sab1', '8h30–11h30', '3 h', 'Simulado cronometrado', 'mat', 'Sem pausas e sem celular.'), b('sab2', '14h–15h30', '1h30', 'Correção + caderno de erros', 'mat', 'Classifique cada erro.'), b('sab3', '16h–17h30', '1h30', 'Redação: 2º texto da semana', 'red', 'Tema diferente do da quarta.')],
    0: [b('dom1', '9h–10h30', '1h30', 'Matemática: refazer erros + tópico difícil', 'mat', 'Volte um degrau se errar demais.'), b('dom2', '10h30–11h30', '1 h', 'Redação: repertório e reescrita', 'red', 'Banco de repertório e conectivos.'), b('dom3', '11h30–12h', '30 min', 'Planejamento da semana', null, 'Ajuste semanal na aba Perfil. Resto do dia livre.')]
  },

  dist: [['Matemática', 7.5], ['Física', 4], ['Raciocínio lógico', 3], ['Redação', 7], ['Simulado, correção e erros', 6], ['Programação (estágio)', 3], ['Outras disciplinas', 3], ['Planejamento', 0.5]],
  regra: ['Com menos tempo, corte primeiro "Outras" e depois a Física da Fase 1.', 'Mantenha Redação ≥ 6 h, Matemática ≥ 6 h e Programação ≥ 2 h.',
          'Em semana de prova, reduza o volume em 30% e não estude conteúdo novo nas últimas 48 h.', 'Durma 7–8 h e deixe o celular fora do bloco.'],
  habit: 'Resolva 1 problema de lógica (15 min) no celular.',

  /* ---------- IMAGENS DA WEB (opcional) ----------
     Cole a URL de uma imagem para trocar a capa gerada. Chaves: mat, log, fis, red, port, prog, hum,
     inteli, fiap, enem1, enem2, mack, imt, uscs, hero-hoje, hero-rotina, hero-plano, hero-materias, hero-erros, hero-perfil.
     Exemplo:  mat: 'https://site.com/foto.jpg'   (precisa de internet ao abrir o app) */
  imagens: { },

  dicasDia: ['Estude 25 min e pause 5: o cérebro rende mais em ciclos curtos.', 'Errou? Escreva a regra no caderno de erros antes de seguir.', 'Comece pelo tópico mais difícil, quando a energia está alta.',
             'Ensinar em voz alta o que você aprendeu revela o que ainda não entendeu.', 'Dormir 7–8 h consolida a memória: não troque sono por horas de estudo.', 'Redação: treine a proposta de intervenção em 5 elementos todo dia.',
             'Resolva questões antes de reler o resumo: a recuperação ativa fixa mais.', 'Deixe o celular em outro cômodo durante o bloco de estudo.'],

  /* ---------- MATÉRIAS ---------- */
  materias: [
    { id: 'mat', nome: 'Matemática', nivel: 3, topicos: ['Base numérica', 'Álgebra', 'Funções e PA/PG', 'Combinatória e probabilidade', 'Geometria'],
      metodo: 'Suba por degraus: só avance com ≥ 70% em 10 questões novas.',
      dicas: ['Traduza o enunciado em equação.', 'No máximo 5 min por questão antes de ver a resolução.', 'Cronômetro em 20% do tempo até 18/10, 50% depois e 100% nos simulados.', 'Refaça erros em D+1, D+7 e D+21.'] },
    { id: 'log', nome: 'Raciocínio lógico', nivel: 3, topicos: ['Conectivos', 'Negação e contrapositiva', 'Quantificadores', 'Diagramas de Venn', 'Verdade/mentira', 'Padrões'],
      metodo: 'Resolva no papel com tabelas e diagramas, sempre cronometrado.',
      dicas: ['Serve para Inteli, FIAP e testes de estágio.', 'Um problema por dia (15 min) vira hábito.', 'Monte a tabela de associação antes de pensar na resposta.'] },
    { id: 'fis', nome: 'Física', nivel: 3, topicos: ['Cinemática', 'Newton', 'Trabalho e energia', 'Eletrodinâmica', 'Termologia', 'Ondas e óptica'],
      metodo: 'Folha de fórmulas com unidades + questões por tópico.',
      dicas: ['Só pesa em ENEM, Mackenzie e IMT: fica em 2 h na Fase 1.', 'Escreva a unidade em toda conta.', 'Aprenda kWh e potência: caem muito no ENEM.'] },
    { id: 'red', nome: 'Redação', nivel: 2, topicos: ['Esqueleto de 4 parágrafos', 'C1 a C5', 'Repertório', 'Proposta de intervenção', 'Perfil do Inteli'],
      metodo: '2 textos por semana (1 planejado, 1 cronometrado em 60–70 min), sempre reescrevendo o anterior.',
      dicas: ['Aparece em 5 das 6 provas: é onde cada hora rende mais.', 'Peça a um professor ou colega que revise 1 texto por semana.', 'Use só repertórios que você entende.', 'Perfil do Inteli: situação, tarefa, ação, resultado, aprendizado.'] },
    { id: 'port', nome: 'Português e Inglês', nivel: 1, topicos: ['Interpretação', 'Crase', 'Concordância', 'Regência', 'Vírgula'],
      metodo: 'Leitura ativa e questões curtas diárias.',
      dicas: ['Zero em Português desclassifica no Mackenzie.', 'Grife a pergunta antes de ler o texto.', 'Conecte gramática à correção da redação (C1).'] },
    { id: 'prog', nome: 'Programação', nivel: 2, topicos: ['Pseudocódigo', 'Python', 'Laços e listas', 'Funções', 'Busca e ordenação', 'Recursão'],
      metodo: 'Papel primeiro, depois código. 10–15 exercícios por semana.',
      dicas: ['Beecrowd, HackerRank ou Exercism (nível iniciante).', 'Curso em Vídeo tem Python grátis.', 'Guarde seus códigos: viram portfólio no GitHub.'] },
    { id: 'hum', nome: 'Humanas, Bio e Química', nivel: 1, topicos: ['Brasil República', 'Globalização', 'Meio ambiente', 'Ecologia e genética', 'Estequiometria e pH'],
      metodo: 'Estude por questões, 1 h por matéria em rodízio.',
      dicas: ['Fase 3: rodízio diário de 45–60 min.', 'Errou uma questão? Escreva a regra no caderno de erros.'] }
  ],

  metodo: [['Aprender (≤ 30 min)', '1 aula ou resumo, anotando 3 ideias.'], ['Imitar (20 min)', 'Copie e refaça 3 exemplos resolvidos sem olhar.'],
           ['Praticar (45 min)', '10–15 questões do fácil ao médio.'], ['Registrar (10 min)', 'Caderno de erros: enunciado curto, erro e regra.'],
           ['Repetir', 'Refaça os erros em D+1, D+7 e D+21.']],

  degraus: [['Degrau 0 · Base numérica', 1, 'Frações, decimais, potências, porcentagem, razão, regra de três.'], ['Degrau 1 · Álgebra', 1, 'Equações de 1º e 2º grau, sistemas, inequações.'],
            ['Degrau 2 · Funções e sequências', 2, 'Afim, quadrática, exponencial, PA/PG, gráficos.'], ['Degrau 3 · Contagem e dados', 2, 'Combinatória, probabilidade, média, mediana e moda.'],
            ['Degrau 4 · Geometria', 3, 'Áreas, Pitágoras, semelhança, volumes, trigonometria.']],
  degrauRegra: 'Suba com ≥ 70% de acerto em 10 questões novas. Volte um degrau se ficar abaixo de 60%.',

  /* ---------- REDAÇÃO ---------- */
  redModelo: [['Introdução (4–5 linhas)', 'Contexto com repertório e tese que anuncia 2 pontos.'], ['Desenvolvimento 1 (7–8 linhas)', 'Argumento, explicação, repertório e consequência.'],
              ['Desenvolvimento 2 (7–8 linhas)', 'Outra dimensão (educação, economia, cultura) e exemplo.'], ['Conclusão (5–6 linhas)', 'Retomada e proposta: agente, ação, meio, finalidade e detalhamento.']],
  competencias: [['C1 · Norma culta', 'Crase, vírgula, concordância, regência, ortografia.'], ['C2 · Tema e repertório', 'Tema respeitado e repertório virou argumento?'],
                 ['C3 · Projeto de texto', 'Tese clara e dois argumentos que progridem.'], ['C4 · Coesão', 'Conectivo variado por período e retomadas.'], ['C5 · Proposta', 'Os 5 elementos estão presentes?']],
  repertorios: ['Constituição, art. 6º', 'Bauman', 'Foucault (panóptico)', 'Bourdieu', 'Durkheim (anomia)', 'Milton Santos', 'Orwell, Huxley e Black Mirror', 'LGPD e Marco Civil', 'Estatutos e Leis (PcD, Idoso, Maria da Penha)', 'ODS da ONU'],
  temas: ['Saúde mental dos jovens', 'Desinformação', 'Apostas on-line', 'Inclusão de neurodivergentes', 'Mobilidade urbana', 'IA e propriedade intelectual', 'Automedicação', 'IA e mercado de trabalho', 'Privacidade e LGPD', 'Desigualdade digital', 'Golpes digitais', 'Vício em telas', 'Mulheres na tecnologia']
};

/* helper para blocos da rotina */
function b(id, t, dur, titulo, m, txt) { return { id, t, dur, titulo, m, txt }; }
