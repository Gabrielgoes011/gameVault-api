# 🎮 GameVault API

O GameVault é uma API RESTful para gerenciamento estruturado de bibliotecas de jogos pessoais. O sistema desvincula o catálogo global de jogos da relação específica de cada usuário, permitindo o rastreamento preciso de status, horas jogadas e avaliações.

## 🎯 O Propósito do Projeto

Este projeto atua como um laboratório prático para consolidar o desenvolvimento backend com Node.js e TypeScript. O foco central não é apenas fazer a aplicação rodar, mas construir uma base de código escalável aplicando fundamentos rigorosos de arquitetura de software, tipagem estática e modelagem relacional.

## 🚀 O Que a API Faz (Features e Regras de Negócio)

O sistema foi desenhado para espelhar o comportamento real de um gerenciador de biblioteca. Ele executa:

* **Gestão do Catálogo Central:** Cadastro de Jogos (títulos, desenvolvedoras, data de lançamento) e Plataformas (PC, PlayStation 5, Xbox, Switch). Este catálogo é estático e global.
* **Vínculo de Biblioteca (User_Games):** A API conecta um usuário a um jogo específico em uma plataforma específica, isolando o estado daquele jogo para aquela pessoa.
* **Controle de Status Dinâmico:** O usuário pode mover os jogos entre diferentes estados: `BACKLOG` (Quero jogar), `PLAYING` (Jogando), `PAUSED` (Pausado), `COMPLETED` (Concluído) ou `DROPPED` (Abandonei).
* **Métricas Pessoais:** Registro independente de horas efetivamente jogadas, notas (rating de 1 a 5) e histórico de datas (quando começou e quando terminou).
* **Garantia de Integridade:** O banco de dados e as regras de negócio impedem que um usuário cadastre acidentalmente "Elden Ring no PC" duas vezes, garantindo dados limpos para a geração de estatísticas futuras.

## 🏗️ Arquitetura e Decisões Técnicas

O projeto descarta o padrão MVC tradicional de pastas globais em favor de uma **Arquitetura Modular Baseada em Domínios (Feature-based)**. 

* **Organização por Contexto:** Tudo relacionado a um domínio (ex: `games`) fica isolado em sua própria pasta, facilitando a manutenção e a escalabilidade se o time crescer.
* **Isolamento de Camadas:**
  * **Routes:** Mapeia as rotas HTTP e repassa para o controlador.
  * **Controller:** Extrai os dados da requisição, chama o serviço e devolve a resposta final (status codes e JSON).
  * **Service:** Concentra exclusivamente a lógica e as regras de negócio.
  * **Repository:** Ponto único de contato com o PostgreSQL. Todo o código SQL fica restrito aqui, permitindo trocar o banco de dados futuramente sem reescrever a aplicação.

## 🛠️ Stack Tecnológica

* **Runtime & Linguagem:** Node.js (ES Modules) com TypeScript.
* **Web Framework:** Express.
* **Banco de Dados:** PostgreSQL (comunicação direta via `pg`, focando no domínio prático da linguagem SQL sem depender de ORMs inicialmente).
* **Ferramentas de Desenvolvimento:** `tsx` para execução e hot-reload nativo de arquivos TypeScript.

## ⚙️ Como executar o projeto localmente

**1. Instale as dependências:**
```bash
npm install