## 🚀 Sobre o Projeto

O CodeInsighter é uma plataforma inovadora desenvolvida para auxiliar na modernização de sistemas legados da Ford. Utilizando IA avançada, nossa solução analisa, documenta e fornece insights para a transformação de códigos antigos em arquiteturas modernas.

### 🎯 Objetivo

Facilitar a transição de sistemas legados para tecnologias modernas, permitindo que equipes mais jovens possam trabalhar com código antigo de forma eficiente e compreensível.

## ✨ Features

- 📁 **Upload Inteligente**
  - Suporte a múltiplos arquivos
  - Análise de pastas completas
  - Drag & drop intuitivo

- 🤖 **Análise com IA**
  - Processamento automático de código
  - Identificação de padrões e estruturas
  - Documentação padronizada

- 📚 **Documentação Inteligente**
  - Visualização interativa de arquivos
  - Detalhamento de funções e parâmetros
  - Sugestões de modernização

- 🏗️ **Insights Arquiteturais**
  - Recomendações de padrões modernos
  - Análise de complexidade
  - Sugestões de migração

## 🛠️ Tecnologias Utilizadas

- **Frontend**
  - React + TypeScript
  - Vite (Build tool)
  - Tailwind CSS
  - shadcn/ui (Componentes)
  - React Router DOM

## 🎨 Design System

O projeto utiliza um design system moderno e consistente:

- **Cores**: Paleta inspirada na identidade da Ford
- **Componentes**: Interface moderna e responsiva
- **Animações**: Transições suaves e feedback visual
- **Temas**: Suporte a modo claro/escuro

## 🚀 Como Executar

1. Clone o repositório para a sua máquina local, abra o Git Bash em algum lugar de sua máquina e digite: 
```bash
git clone https://github.com/GabrielFMontoni/CodeInsighter.git
```
2. Abra a pasta do projeto na sua IDE de preferência

3. Crie o arquivo .env na pasta backend
Antes de iniciar, é necessário criar um arquivo chamado .env na pasta backend do projeto com as seguintes variáveis de ambiente:
GOOGLE_API_KEY= SUA_CHAVE_GEMINI_API
GITHUB_TOKEN= SEU_TOKEN_GITHUB
GOOGLE_MODEL=gemini-2.0-flash
GOOGLE_EMBEDDINGS_MODEL=text-embedding-004
PORT=3000
(É importante manter a porta como 3000, pois é a porta que a API do backend irá rodar)
 
Onde obter as chaves:
•	GOOGLE_API_KEY:
Gere uma chave de API na Google AI Studio para utilizar o modelo Gemini 2.0 Flash.
Essa chave é usada pela IA do Code Insighter para processar, documentar e sugerir melhorias no código.
•	GITHUB_TOKEN:
Crie um token pessoal de acesso no GitHub Developer Settings (opção “Tokens (classic)”) com permissão de leitura em repositórios.
Esse token é utilizado para realizar requisições seguras e buscar metadados de código.

4. Abra o terminal na IDE (Ctrl + ‘) e instale as dependências com o comando
```bash
   npm install
```

5. Execute o projeto
O comando abaixo instalará dependências do backend e frontend, e iniciará ambos simultaneamente:
```bash
   npm run dev
```
6. Acesse no navegador
Após a inicialização, o projeto poderá ser acessado em:
http://localhost:8080 

📱 Screenshots



<div align="center"> Desenvolvido com 💙 para o Ford Innovation Challenge x FIAP </div>