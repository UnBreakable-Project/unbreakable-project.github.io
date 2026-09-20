# UnBreakable — Site Institucional

Site institucional do **UnBreakable**, grupo de estudos de segurança ofensiva da Universidade de Brasília (UnB), publicado via GitHub Pages.

**Stack:** React 18, Vite 8 (sem router SPA, sem backend).

---

## Pré-requisitos

- **Node.js** 20+
- **npm**

---

## Como rodar

- **Instalar dependências:**
  ```bash
  npm ci
  ```
- **Desenvolvimento local:**
  ```bash
  npm run dev
  ```
- **Build de produção:**
  ```bash
  npm run build
  ```
- **Verificação completa (lint + format check + testes + build):**
  ```bash
  npm run check
  ```
- **Visualizar o build localmente:**
  ```bash
  npm run preview
  ```

---

## Estrutura do Projeto

Principais diretórios e arquivos:

- `src/content/site.mdx` — Todo o conteúdo editável (textos, equipe, eventos, FAQ). Edite texto aqui sem tocar no JSX.
- `src/App.jsx` — Componentes de todas as páginas e roteamento.
- `src/index.css` — Folha de estilo única, contendo os design tokens em `:root`.
- `src/features/identidade-visual/` — Galeria de identidade visual.
- `src/assets/Fotos-gestão/` — Fotos da equipe.
- `public/identidade-visual/` — Assets da marca (logos, ícones, cores, circuitos).
- `scripts/` — Scripts de build auxiliares.

---

## Como editar conteúdo

Todo o conteúdo textual do site fica centralizado em `src/content/site.mdx`, que exporta o objeto `siteContent`.

Esse objeto reúne todas as informações exibidas nas páginas:

- Textos institucionais e seções da Home
- Membros da equipe
- Eventos e atividades
- Perguntas frequentes (FAQ)

Para modificar textos, adicionar ou alterar eventos ou atualizar itens do FAQ, basta editar `src/content/site.mdx` diretamente, sem necessidade de alterar código JSX ou componentes.

---

## Identidade Visual

- Os assets da marca ficam armazenados em `public/identidade-visual/`, organizados por categoria (logos, ícones, cores, circuitos).
- O manifesto de assets (`src/data/visual-identity-manifest.js`) é gerado automaticamente pelo plugin/scripts do Vite. **Não edite esse arquivo manualmente**.
- Os metadados de exibição (rótulo, uso, ordem) são configurados em `src/content/site.mdx`.

---

## Como atualizar a equipe

Para adicionar ou remover integrantes da equipe:

1. **Adicionar membro:**
   - Adicione a foto do novo membro em `src/assets/Fotos-gestão/`.
   - Adicione a entrada correspondente com as informações no array `members` em `src/content/site.mdx`.
2. **Remover membro:**
   - Remova a entrada correspondente do array `members` em `src/content/site.mdx`.
   - Apague a foto do membro em `src/assets/Fotos-gestão/`.

---

## Deploy

O deploy é automático via **GitHub Actions** configurado em `.github/workflows/deploy.yml`:

- Push na branch `main` → Execução de `npm run check` (lint + format check + testes + build) → Deploy no **GitHub Pages**.
