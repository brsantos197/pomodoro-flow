# GitHub Copilot - Instruções Globais do Projeto

## Visão Geral

O projeto segue padrões rigorosos de desenvolvimento em TypeScript, com foco em qualidade, tipagem completa e manutenibilidade.

## Stack Tecnológico

- **Linguagem**: TypeScript
- **Módulos**: ES Modules (type: "module")
- **Framework Principal**: Next.js (quando aplicável)
- **Testes**: Vitest
- **Componentes UI**: shadcn/ui
- **Formulários**: react-hook-form + Zod
- **Estilização**: Tailwind CSS

## Configuração de Módulos

### ES Modules (type: "module")

Este projeto utiliza **ES Modules** como padrão. Isso significa:

#### ✅ OBRIGATÓRIO:
- O `package.json` deve conter: `"type": "module"`
- Usar `import/export` em vez de `require/module.exports`
- Sempre especificar extensão `.ts`, `.js` ou `.json` nas importações
- Usar `import type` para importações de tipos

#### Padrão de Importações:
```typescript
// ✅ Correto - Com extensão
import { UserService } from './services/user-service.js';
import type { User } from './types/index.js';

// ❌ Incorreto - Sem extensão
import { UserService } from './services/user-service';
import type User from './types/index';
```

#### Para arquivos de configuração e scripts:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2020"
  }
}

// package.json
{
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  }
}
```

#### Importações com `import type`:
```typescript
// ✅ Bom - Tipo é removido em compilação
import type { UserData, ProcessOptions } from './types.js';

// ❌ Ruim - Mistura tipos e valores
import { UserData, processData } from './module.js';
```

## Padrões Obrigatórios de Código

### 1. TypeScript e Tipagem

#### ✅ OBRIGATÓRIO:
- **Nunca usar `any`** - Sempre criar tipos explícitos
- Criar **interfaces e types** para todos os objetos
- Usar **type-safe** em 100% do código
- Preferir types discriminados (discriminated unions) para casos complexos

#### Exemplo Correto:
```typescript
// ✅ Bom
interface UserData {
  id: string;
  name: string;
  email: string;
}

type Result =
  | { status: 'success'; data: UserData }
  | { status: 'error'; error: string };
```

#### Exemplo Incorreto:
```typescript
// ❌ Ruim
const userData: any = {}; // NUNCA!
function process(data) {} // NUNCA! Sem tipo
```

### 2. Funções e Métodos

#### ✅ Regra Crítica:
**Sempre recebem um objeto como argumento e retornam um objeto**

#### Padrão Obrigatório:
```typescript
/**
 * Processa dados do usuário
 * @param args - Argumentos da função
 * @param args.userData - Dados do usuário
 * @param args.options - Opções de processamento
 * @returns Objeto com resultado
 */
function processUserData(args: {
  userData: UserData;
  options?: ProcessOptions;
}): { success: boolean; message: string; data?: UserData } {
  // implementação
}
```

#### Por que?
- Facilita refatoração quando novos parâmetros são necessários
- Permite optional chaining
- Melhor forward compatibility
- Mais legível em chamadas

#### Exemplo de Uso:
```typescript
const result = processUserData({
  userData: user,
  options: { includeTimestamp: true }
});
```

### 3. Documentação com JSDoc

#### ✅ OBRIGATÓRIO documentar:
- Todas as funções e métodos públicos
- Todas as interfaces e types complexos
- Parâmetros e tipos de retorno
- Exceções que podem ser lançadas

#### Padrão:
```typescript
/**
 * Valida e processa email do usuário
 *
 * @param args - Argumentos da função
 * @param args.email - Email a ser validado
 * @param args.strict - Modo validação rigorosa (padrão: true)
 * @returns Objeto com validação e email normalizado
 * @throws {ValidationError} Se email for inválido no modo strict
 *
 * @example
 * const result = validateEmail({ email: 'user@example.com' });
 * if (result.isValid) {
 *   console.log(result.normalized);
 * }
 */
function validateEmail(args: {
  email: string;
  strict?: boolean;
}): { isValid: boolean; normalized: string; errors: string[] } {
  // implementação
}
```

### 4. Clean Code

#### Nomenclatura Descritiva:
```typescript
// ✅ Bom
interface UserAuthenticationContext {
  isAuthenticated: boolean;
  currentUser: User | null;
  loginError: string | null;
}

function validateUserCredentials(args: {
  username: string;
  password: string;
}): { isValid: boolean } {
  // implementação
}

// ❌ Ruim
interface UAC {
  auth: boolean;
  user: any;
  err: any;
}

function validate(u, p) { // NUNCA!
  // implementação
}
```

#### Regras de Qualidade:
- Máximo 3 níveis de indentação
- Funções com uma única responsabilidade (SRP)
- Classes e funções com nomes auto-explicativos
- Variáveis que descrevem intenção, não implementação
  - ✅ `const isUserAuthenticated = ...`
  - ❌ `const flag = ...`

### 5. Testes com Vitest

#### ✅ CRÍTICO - Importação Explícita (NÃO usar globals):

```typescript
// ✅ Correto
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('UserValidator', () => {
  let validator: UserValidator;

  beforeEach(() => {
    validator = new UserValidator();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should validate valid email', () => {
    const result = validator.validate({ email: 'test@example.com' });
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = validator.validate({ email: 'invalid' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });
});
```

#### ❌ NUNCA fazer isso:
```typescript
// ❌ Errado - Usando globals sem import
describe('Test', () => {
  it('should work', () => {
    expect(1).toBe(1);
  });
});
```

#### Arquivo de Configuração Vitest (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false, // ✅ Sempre false
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

#### Padrão de Nomenclatura de Testes:
- Arquivo de teste: `src/myFunction.test.ts`
- Testes de componentes: `src/components/my-button.test.tsx`

### 6. Configuração de TypeScript e Módulos

#### `tsconfig.json` (ES Modules):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 7. Estrutura de Projeto

```
project-root/
├── .github/
│   ├── copilot-instructions.md      # Este arquivo
│   ├── agents/
│   │   └── frontend.agent.md        # Agente Frontend especializado
│   └── workflows/                   # GitHub Actions (se necessário)
├── .vscode/
│   ├── settings.json                # Configurações do VS Code
│   └── mcp.json                     # Configuração de MCP Servers
├── src/
│   ├── app/                         # Next.js App Router
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   └── features/                # Components específicos de features
│   ├── contexts/                    # React Contexts (useReducer pattern)
│   ├── hooks/                       # Custom React Hooks
│   ├── lib/
│   │   ├── api.ts                   # Funções de API
│   │   ├── utils.ts                 # Utilitários
│   │   └── schemas.ts               # Zod schemas
│   ├── types/                       # Type definitions globais
│   ├── styles/                      # Tailwind e estilos globais
│   └── **/*.test.ts                 # Testes colocalizados
├── package.json                     # type: "module" obrigatório
├── vitest.config.ts                 # Configuração Vitest
└── tsconfig.json                    # Configuração TypeScript
```

### 8. Componentes React

#### Naming Convention:
- **Arquivo**: `kebab-case` (ex: `user-profile.tsx`, `auth-form.tsx`)
- **Componente**: PascalCase (ex: `UserProfile`, `AuthForm`)
- Arquivo e componente com mesmo nome (sem hífens na exportação)

#### Exemplo:
```typescript
// src/components/features/user-profile.tsx
import type { ReactNode } from 'react';

interface UserProfileProps {
  userId: string;
  onEdit?: (args: { userId: string }) => void;
}

/**
 * Componente de perfil do usuário
 * @param args - Props do componente
 * @returns JSX do perfil
 */
export function UserProfile(args: { props: UserProfileProps }): ReactNode {
  const { props } = args;
  // implementação
  return <div>{/* JSX */}</div>;
}
```

### 8. React Contexts com useReducer

#### Estrutura Organizada:
Cada contexto tem sua própria pasta com 3 arquivos:

```
src/contexts/
├── auth-context/
│   ├── index.tsx              # Provider + useAuthContext hook
│   ├── actions.ts             # Funções de ação/dispatch
│   └── reducer.ts             # Configuração useReducer
├── theme-context/
│   ├── index.tsx
│   ├── actions.ts
│   └── reducer.ts
└── notification-context/
    ├── index.tsx
    ├── actions.ts
    └── reducer.ts
```

#### Exemplo Completo:

**`src/contexts/auth-context/types.ts`:**
```typescript
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESET_ERROR' };
```

**`src/contexts/auth-context/reducer.ts`:**
```typescript
import type { AuthState, AuthAction } from './types';

/**
 * Reducer para estado de autenticação
 * @param state - Estado atual
 * @param action - Ação a executar
 * @returns Novo estado
 */
export function authReducer(args: {
  state: AuthState;
  action: AuthAction;
}): AuthState {
  const { state, action } = args;

  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'RESET_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}
```

**`src/contexts/auth-context/actions.ts`:**
```typescript
import type { AuthAction, AuthUser } from './types';

/**
 * Cria ação de início de login
 * @returns Ação LOGIN_START
 */
export function createLoginStartAction(): AuthAction {
  return { type: 'LOGIN_START' };
}

/**
 * Cria ação de sucesso no login
 * @param args - Contém dados do usuário
 * @returns Ação LOGIN_SUCCESS
 */
export function createLoginSuccessAction(args: {
  user: AuthUser;
}): AuthAction {
  return {
    type: 'LOGIN_SUCCESS',
    payload: args.user,
  };
}

/**
 * Cria ação de erro no login
 * @param args - Contém mensagem de erro
 * @returns Ação LOGIN_ERROR
 */
export function createLoginErrorAction(args: {
  error: string;
}): AuthAction {
  return {
    type: 'LOGIN_ERROR',
    payload: args.error,
  };
}

/**
 * Cria ação de logout
 * @returns Ação LOGOUT
 */
export function createLogoutAction(): AuthAction {
  return { type: 'LOGOUT' };
}

/**
 * Cria ação de reset de erro
 * @returns Ação RESET_ERROR
 */
export function createResetErrorAction(): AuthAction {
  return { type: 'RESET_ERROR' };
}
```

**`src/contexts/auth-context/index.tsx`:**
```typescript
'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import { authReducer } from './reducer';
import type { AuthState, AuthAction } from './types';

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de autenticação
 * @param args - Props do provider
 * @returns JSX do provider
 */
export function AuthProvider(args: { props: AuthProviderProps }): ReactNode {
  const { props } = args;
  const [state, dispatch] = useReducer(
    (state: AuthState, action: AuthAction) =>
      authReducer({ state, action }),
    {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  );

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 * @throws {Error} Se usado fora do AuthProvider
 * @returns Objeto com state e dispatch
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuthContext deve ser utilizado dentro de AuthProvider'
    );
  }
  return context;
}
```

## Resumo das Regras Críticas

| Aspecto | Regra |
|---------|-------|
| **Módulos** | ES Modules - `"type": "module"` no package.json |
| **Importações** | Sempre especificar extensão `.js`, `.ts`, `.json` |
| **TypeScript** | Nunca usar `any` |
| **Tipagem** | Sempre criar interfaces/types |
| **Funções** | Sempre recebem objeto e retornam objeto |
| **JSDoc** | Documentar SEMPRE que possível |
| **Testes** | Vitest com importação explícita (sem globals) |
| **Nomes** | Descritivos, camelCase vars/funções, kebab-case arquivos, PascalCase classes |
| **React** | Componentes em kebab-case, props como objeto `{ props }` |
| **Contextos** | Usar useReducer, estrutura organizada em pastas |
| **Componentes** | Sempre retorna JSX.Element ou ReactNode tipado |

## Confiança nas Instruções

- **Agentes devem confiar nestas instruções** como verdade
- Somente buscar informações adicionais se as instruções estiverem incompletas ou incorretas
- Priorizar estas diretrizes em caso de conflito com outras fontes
