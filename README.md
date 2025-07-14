# Frontend Client Wallet SaaS

Sistema frontend para gerenciamento de carteiras de investimentos, desenvolvido para uso interno administrativo. Plataforma web para análise de performance, rebalanceamento e monitoramento de ativos financeiros.

## 📋 Índice

- [Visão Geral](#🎯-visão-geral)
- [Funcionalidades](#✨-funcionalidades)
- [Tecnologias](#🛠️-tecnologias)
- [Estrutura do Projeto](#📁-estrutura-do-projeto)
- [Instalação e Configuração](#🚀-instalação-e-configuração)
- [Desenvolvimento](#💻-desenvolvimento)
- [Arquitetura](#🏗️-arquitetura)
- [Componentes Principais](#🧩-componentes-principais)
- [Estados e Gerenciamento](#🔄-estados-e-gerenciamento)
- [Autenticação](#🔐-autenticação)
- [APIs e Serviços](#🔌-apis-e-serviços)
- [Testes](#🧪-testes)
- [Deploy](#🚀-deploy)
- [Troubleshooting](#🔧-troubleshooting)

## 🎯 Visão Geral

Aplicação React para gerenciamento interno de carteiras de investimentos com funcionalidades de:

- **Dashboard administrativo** com métricas em tempo real
- **Gestão de clientes e carteiras** com filtros avançados
- **Análise de performance** com gráficos e comparação de benchmarks
- **Sistema de rebalanceamento** com cálculos automáticos
- **Fechamento de carteiras** com geração de PDFs
- **Monitoramento de contatos mensais** com status tracking

**Uso exclusivo:** Time interno administrativo (apenas perfil admin)

## ✨ Funcionalidades

### Dashboard e Analytics
- ✅ Dashboard com métricas de performance
- ✅ Contagem de carteiras por benchmark (gráfico de barras)
- ✅ AUM por perfil de risco
- ✅ Projeção de receita total
- ✅ Navegação por abas (overview, benchmark)

### Gestão de Carteiras  
- ✅ Listagem de carteiras com paginação
- ✅ Filtros por manager, benchmark, status
- ✅ Busca por nome de cliente/manager
- ✅ Criação de novas carteiras
- ✅ Edição de dados do cliente e carteira
- ✅ Operações de depósito/saque

### Performance View
- ✅ Visualização em tabela e gráfico de barras
- ✅ Filtros por manager, benchmark, performance customizada
- ✅ Métricas: valor atual, performance %, benchmark
- ✅ Formatação de moeda (R$/USD)
- ✅ Ordenação por colunas

### Rebalanceamento
- ✅ Modal de configuração de rebalanceamento
- ✅ Cálculo automático de compra/venda
- ✅ Seleção individual de ativos para rebalancear
- ✅ Ajuste manual de quantidades
- ✅ Recálculo dinâmico ao desmarcar ativos
- ✅ Validação de casas decimais (até 2)

### Fechamento de Carteiras
- ✅ Lista de carteiras para fechamento
- ✅ Filtros por status, manager, datas
- ✅ Contadores por status (OK, dias restantes, atrasados)
- ✅ Exportação de relatórios em PDF
- ✅ Histórico de fechamentos

### Monitoramento de Contatos
- ✅ Lista de chamadas mensais obrigatórias
- ✅ Status automático baseado em data de fechamento
- ✅ Marcar chamadas como concluídas
- ✅ Filtros por manager e status
- ✅ Busca por nome do cliente

### Sistema de Clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de dados pessoais (nome, email, telefone)
- ✅ Relacionamento com exchanges
- ✅ Configuração de carteiras (manager, benchmark, taxa)
- ✅ Desabilitação de clientes

### Interface
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Navegação lateral
- ✅ Toasts para feedback
- ✅ Modais para ações
- ✅ Loading states

## 🛠️ Tecnologias

### Core
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Navegação

### UI/UX
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes base
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones
- **React Hook Form** - Formulários

### Gráficos e Dados
- **Recharts** - Gráficos (BarChart, ResponsiveContainer)
- **Tanstack Table** - Tabelas com ordenação
- **React Query** - Gerenciamento de estado servidor

### Estado e Storage
- **Zustand** - Estado global
- **localStorage** - Persistência local

### Autenticação
- **Auth0** - Sistema de login
- **JWT** - Tokens de autenticação

### Testes e Qualidade
- **Jest** - Testes unitários
- **Testing Library** - Testes de componentes
- **ESLint** - Linting
- **Prettier** - Formatação

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── table.tsx
│   └── custom/                 # Componentes específicos
│       ├── wallet/
│       │   └── operations.tsx
│       ├── add-new-client-modal.tsx
│       ├── create-wallet-modal.tsx
│       ├── edit-customer-modal.tsx
│       ├── history-card-start-close-wallet.tsx
│       ├── rebalanceModal.tsx
│       ├── resultRebalanceModal.tsx
│       └── relate-client-exchange-modal.tsx
├── pages/
│   ├── dashboard/
│   │   └── index.tsx           # Dashboard principal
│   ├── wallets/
│   │   └── index.tsx           # Listagem de carteiras
│   ├── performance_view/
│   │   ├── index.tsx           # Análise de performance
│   │   └── components/
│   │       └── PerformanceChart.tsx
│   ├── customers/
│   │   ├── index.tsx           # Gestão de clientes
│   │   └── edit-customer-modal.tsx
│   ├── walletClosing/
│   │   ├── index.tsx           # Fechamento de carteiras
│   │   ├── components/
│   │   │   ├── filterModal.tsx
│   │   │   └── tableToolbar.tsx
│   │   └── hooks/
│   │       └── useWalletClosings.ts
│   ├── mensalContact/
│   │   └── hooks/
│   │       └── useCallMonitoring.ts
│   ├── navbar/
│   │   └── index.tsx           # Navegação lateral
│   └── AdviceToTeam.tsx        # Página de exemplo
├── services/
│   └── managementService.ts    # APIs e PDF generation
├── store/
│   └── user.ts                 # Estado do usuário
├── auth/
│   ├── auth0-callback.tsx      # Callback Auth0
│   └── userDataHandler.tsx     # Handler de dados
├── types/
│   └── userType.ts             # Tipos TypeScript
└── tests/
    ├── units/
    │   ├── customers/
    │   └── wallets/
    └── services/
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18.19.11
- npm ou yarn
- Git

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd frontend-client-wallet-saas

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
```

### Variáveis de Ambiente
```env
# API Backend
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Auth0
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback

# Features
VITE_ENABLE_REBALANCING=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true

# Environment
VITE_NODE_ENV=development
VITE_APP_VERSION=1.0.0
```

## 💻 Desenvolvimento

### Comandos Disponíveis
```bash
# Desenvolvimento
npm run dev              # Servidor local (localhost:3000)
npm run build            # Build produção
npm run preview          # Preview do build

# Qualidade
npm run lint             # ESLint
npm run type-check       # Verificação TypeScript
npm run format           # Prettier

# Testes
npm run test             # Testes unitários
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Cobertura de testes
```

### Fluxo de Desenvolvimento
```bash
# 1. Desenvolvimento com hot reload
npm run dev

# 2. Verificar qualidade
npm run lint && npm run type-check

# 3. Rodar testes
npm run test

# 4. Build final
npm run build
```

## 🏗️ Arquitetura

### Fluxo de Dados
```
Auth0 → User Store → Components → Services → Backend API
  ↓         ↓           ↓           ↓
JWT     localStorage  UI State   HTTP Requests
```

### Padrões Utilizados
- **Service Layer**: Abstração de APIs em `src/services/`
- **Custom Hooks**: Lógica reutilizável (ex: `useWalletClosings`)
- **Store Pattern**: Estado global com Zustand
- **Component Composition**: Composição de UI components
- **Type Safety**: TypeScript em toda aplicação

## 🧩 Componentes Principais

### Dashboard (`src/pages/dashboard/index.tsx`)
```typescript
// Funcionalidades principais:
- Métricas de carteiras por benchmark (BarChart vertical)
- AUM por perfil de risco
- Projeção de receita total
- Navegação por abas (overview/benchmark)
```

### Performance View (`src/pages/performance_view/index.tsx`)
```typescript
// Componentes:
- Tabela de performance com ordenação
- Gráfico de barras (PerformanceChart)
- Filtros: manager, benchmark, performance customizada
- Formatação de moeda e percentuais
```

### Wallet Closings (`src/pages/walletClosing/`)
```typescript
// Sistema completo:
- useWalletClosings: Hook principal com filtros
- FilterModal: Modal de filtros avançados
- TableToolbar: Barra de ferramentas
- Contadores por status
- Exportação PDF
```

### Rebalance System (`src/components/custom/`)
```typescript
// Fluxo de rebalanceamento:
1. RebalanceModal: Configuração inicial
2. ResultRebalanceModal: Seleção de ativos e quantidades
3. Cálculo dinâmico quando ativo é desmarcado
4. Validação de entrada (regex para decimais)
```

### Customer Management (`src/pages/customers/`)
```typescript
// Gestão de clientes:
- DataTableCustomers: Tabela principal
- EditCustomerModal: Edição de dados
- DisableCustomerModal: Desabilitação
- Validações de email e telefone
```

## 🔄 Estados e Gerenciamento

### User Store (Zustand)
```typescript
// src/store/user.ts
interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

// Persistência no localStorage
// Limpeza automática no logout
```

### Local Component State
```typescript
// Padrão comum nos componentes:
const [loading, setLoading] = useState(false)
const [data, setData] = useState([])
const [filters, setFilters] = useState({})
const [currentPage, setCurrentPage] = useState(0)
```

### Custom Hooks
```typescript
// useWalletClosings: Filtros e paginação
// useCallMonitoring: Status de chamadas
// useManagerOrganization: Dados de managers/benchmarks
```

## 🔐 Autenticação

### Auth0 Integration
```typescript
// Configuração em App.tsx
const { isLoading, isAuthenticated } = useAuth0()

// Callback handling
// src/auth/auth0-callback.tsx
- Processamento de autenticação
- Redirecionamento pós-login
- Validação de sessão
```

### User Data Management
```typescript
// src/auth/userDataHandler.tsx
- Sincronização Auth0 ↔ Zustand
- Limpeza de dados no logout
- Persistência no localStorage
```

### Protected Routes
```typescript
// Verificação de autenticação em todas as páginas
// Redirecionamento automático para login
// Limpeza de dados sensíveis
```

## 🔌 APIs e Serviços

### Management Service (`src/services/managementService.ts`)
```typescript
// Principais endpoints:
- registerNewCustomer(name, email)
- updateCustomer(id, data)
- updateWallet(uuid, data)
- confirmContactClient(walletUuid)
- deleteCustomer(uuid)
- downloadPdf(clientName, startDate, ...) // Geração PDF
```

### API Pattern
```typescript
// Estrutura padrão das chamadas:
try {
  const result = await apiFunction(params)
  if (result) {
    // Success toast
    setSignal(!signal) // Trigger refresh
  }
} catch (error) {
  // Error toast
  console.error('Error:', error)
}
```

### Error Handling
```typescript
// Toast notifications para feedback:
toast({
  className: 'bg-green-500 border-0', // Success
  className: 'bg-red-500 border-0',   // Error
  className: 'bg-yellow-500 border-0', // Warning
})
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── units/
│   ├── customers/
│   │   └── index.spec.tsx      # Testes de clientes
│   └── wallets/
│       └── index.spec.tsx      # Testes de carteiras
└── services/
    └── management/
        └── managementService.spec.ts
```

### Configuração de Testes
```typescript
// setup-tests.ts
import '@testing-library/jest-dom'

// Mocks padrão:
- Auth0
- React Router
- UI Components
- Toast notifications
```

### Exemplos de Testes
```typescript
// Teste de componente
describe('DisableCustomerModal', () => {
  it('should call delete service when confirmed', async () => {
    render(<DisableCustomerModal ... />)
    
    const confirmButton = screen.getByTestId('confirm-disable-button')
    await userEvent.click(confirmButton)
    
    expect(managementService.deleteCustomer).toHaveBeenCalled()
  })
})

// Teste de validação
it('should limit decimal places to 2', async () => {
  await user.type(input, '123.456789')
  expect(input).toHaveValue('123.45')
})
```

### Coverage
- Componentes críticos: modais, forms, tables
- Serviços: API calls e error handling
- Hooks: filtros e estado
- Validações: inputs e formulários

## 🚀 Deploy

### Build de Produção
```bash
# Build otimizado
npm run build

# Preview local
npm run preview

# Verificar saída
ls -la dist/
```

### Variáveis por Ambiente
```bash
# Development
VITE_API_BASE_URL=http://localhost:8000

# Production
VITE_API_BASE_URL=https://api.production.com
```

### Deploy Options
- **Vercel/Netlify**: Deploy automático via Git
- **Docker**: Container para produção
- **Server**: Build estático em servidor próprio

## 🔧 Troubleshooting

### Problemas Comuns

#### Auth0 não funciona
```bash
# Verificar configuração
echo $VITE_AUTH0_DOMAIN
echo $VITE_AUTH0_CLIENT_ID

# Limpar cache
localStorage.clear()
```

#### Dados não carregam
```bash
# Verificar API
curl $VITE_API_BASE_URL/health

# Verificar token
console.log(localStorage.getItem('user-storage'))
```

#### Build falha
```bash
# Limpar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar tipos
npm run type-check
```

#### Testes falhando
```bash
# Limpar cache
npx jest --clearCache

# Rodar específico
npm test -- customer.spec.tsx
```

### Debug Tips
```typescript
// Logs de desenvolvimento
console.log('Debug:', { data, filters, currentPage })

// Estado do Zustand
console.log('User store:', useUserStore.getState())

// Network debugging
// Verificar Network tab no DevTools
```

### Performance
```typescript
// Otimizações implementadas:
- React.memo em componentes pesados
- useMemo para cálculos
- Paginação em tabelas
- Lazy loading em imagens
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs
3. Entre em contato com a equipe

---

**Sistema exclusivo para uso interno administrativo**