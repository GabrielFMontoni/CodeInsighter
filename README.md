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
<img width="906" height="569" alt="image" src="https://github.com/user-attachments/assets/1697e27e-adbf-4d32-81f4-90bab69d7328" />

2. Abra a pasta do projeto na sua IDE de preferência
  <img width="372" height="617" alt="image" src="https://github.com/user-attachments/assets/656e7a43-9812-4887-a25e-ce7f7e293023" />


3. Crie o arquivo .env na pasta backend
   
    Antes de iniciar, é necessário criar um arquivo chamado .env na pasta backend do projeto com as seguintes variáveis de ambiente:
   
    GOOGLE_API_KEY= SUA_CHAVE_GEMINI_API
   
    GITHUB_TOKEN= SEU_TOKEN_GITHUB
   
    GOOGLE_MODEL=gemini-2.0-flash
   
    GOOGLE_EMBEDDINGS_MODEL=text-embedding-004
   
    PORT=3000

(É importante manter a porta como 3000, pois é a porta que a API do backend irá rodar)
<img width="1098" height="393" alt="image" src="https://github.com/user-attachments/assets/a36cb92a-82dc-4ae7-b0a5-9f38ed6a8cdf" />

### Onde obter as chaves:

  •	GOOGLE_API_KEY:
  Gere uma chave de API na Google AI Studio para utilizar o modelo Gemini 2.0 Flash.
  Essa chave é usada pela IA do Code Insighter para processar, documentar e sugerir melhorias no código.
  
  •	GITHUB_TOKEN:
  Crie um token pessoal de acesso no GitHub Developer Settings (opção “Tokens (classic)”) com permissão de leitura em repositórios.
  Esse token é utilizado para realizar requisições seguras e buscar metadados de código.

OBS: Lembre-se de salvar o arquivo após editar as variáveis.

4. Abra o terminal na IDE (Ctrl + ‘) e instale as dependências com o comando
```bash
   npm install
```
<img width="719" height="313" alt="image" src="https://github.com/user-attachments/assets/b7e27d0b-c05e-4dd2-bc92-1279353ed43d" />

5. Execute o projeto
O comando abaixo instalará dependências do backend e frontend, e iniciará ambos simultaneamente:
```bash
   npm run dev
```
6. Acesse no navegador
Após a inicialização, o projeto poderá ser acessado em:
http://localhost:8080 
<img width="879" height="705" alt="image" src="https://github.com/user-attachments/assets/6cf7e240-f2c4-440d-a468-ed9c5b51bafa" />



### 📱 Screenshots

<img width="1013" height="531" alt="image" src="https://github.com/user-attachments/assets/24c305d9-a645-44e9-a3d3-1946b97fdee3" />
<img width="1098" height="571" alt="image" src="https://github.com/user-attachments/assets/0256c110-ec5e-42b3-9bb4-e4f93a13371f" />
<img width="1098" height="559" alt="image" src="https://github.com/user-attachments/assets/15d52fe8-d94c-43ee-b651-e18867e2cb03" />
<img width="1098" height="556" alt="image" src="https://github.com/user-attachments/assets/eb982b9a-3863-4389-a8c0-583481c07d80" />
<img width="987" height="383" alt="image" src="https://github.com/user-attachments/assets/f4b6f0dc-a8e9-438d-9d70-fc463a3acf15" />
<img width="947" height="409" alt="image" src="https://github.com/user-attachments/assets/42a4c02d-24d4-42cf-a232-39e41796eedd" />
<img width="934" height="820" alt="image" src="https://github.com/user-attachments/assets/505ccc15-2748-42df-a9b7-ca4fda8ebc6d" />



<div align="center"> Desenvolvido com 💙 para o Ford Innovation Challenge x FIAP </div>
