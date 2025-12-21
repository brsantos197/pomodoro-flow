# Pomodoro Flow

Um aplicativo de produtividade com temporizador Pomodoro, sistema de níveis/XP, integração de tarefas e notificações.

Estrutura principal

- `apps/web` - Aplicação Next.js (UI principal do usuário).
- `packages/*` - Configurações compartilhadas (eslint, tsconfig, etc.).
- `ui/src` - Componentes UI reutilizáveis.

Requisitos

- Node.js 18+ (recomendado)
- pnpm

Instalação (na raiz)

```bash
pnpm install
```

Executando em desenvolvimento

```bash
# rodar a aplicação web (dentro da pasta apps/web)
cd apps/web
pnpm install
pnpm dev
```

Scripts úteis

- `pnpm install` — instala dependências do monorepo
- `pnpm --filter web dev` — inicia apenas a aplicação web (se configurado)

Contribuindo

- Abra uma issue para discutir alterações grandes.
- Envie PRs com um único propósito por branch.

Observações

- Este repositório usa uma estrutura monorepo com pnpm e Turbo.
- Consulte `apps/web` para detalhes específicos da aplicação.

