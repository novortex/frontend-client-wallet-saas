# Style Guide - Button Standards

Este guia define os padrões padronizados para botões em todo o projeto, baseado no design da página `/infos`.

## 🎯 Padrões de Botões

### 1. Botões de Ação Principal
**Uso**: Ações principais como navegação, abrir modais, submeter formulários

```tsx
className="flex h-11 items-center gap-2 bg-primary px-4 font-medium text-primary-foreground transition-all duration-200 transform hover:scale-105 hover:bg-primary/90 hover:text-white"
```

**Características**:
- Altura fixa: `h-11`
- Efeito de expansão: `hover:scale-105`
- Texto branco no hover: `hover:text-white`
- Transição suave: `transition-all duration-200 transform`

### 2. Botões Secundários (Primary)
**Uso**: Ações especiais como KPIs, operações financeiras, triggers

```tsx
className="flex items-center gap-2 bg-primary px-4 font-medium text-primary-foreground transition-all duration-200 transform hover:scale-105 hover:bg-primary/90 hover:text-white"
```

**Características**:
- Fundo primary: `bg-primary`
- Texto primary-foreground: `text-primary-foreground`
- Hover primary: `hover:bg-primary/90`
- Efeito de expansão: `hover:scale-105`

### 3. Botões Outline
**Uso**: Ações secundárias como "Historic", navegação não-primária

```tsx
className="flex items-center gap-2 px-4 font-medium transition-all duration-200 transform hover:scale-105 hover:bg-gray-200 hover:text-white dark:hover:bg-gray-800"
```

**Características**:
- Variant: `variant="outline"`
- Efeito de expansão: `hover:scale-105`
- Fundo cinza no hover: `hover:bg-gray-200`

### 4. Botões de Copiar
**Uso**: Botões pequenos para copiar informações

```tsx
className="h-6 w-6 p-0 bg-yellow-400 text-black transition-all duration-200 transform hover:scale-110 hover:bg-yellow-500 hover:text-white"
```

**Características**:
- Tamanho pequeno: `h-6 w-6`
- Fundo amarelo claro: `bg-yellow-400`
- Expansão maior: `hover:scale-110`
- Hover amarelo médio: `hover:bg-yellow-500`

### 5. Botões de Estado (Dinâmicos)
**Uso**: Botões que mudam cor baseado no estado (abrir/fechar carteira)

```tsx
className={`flex items-center gap-2 px-4 font-medium text-white transition-all duration-200 transform hover:scale-105 hover:text-white ${
  condition 
    ? 'bg-[#10A45C] hover:bg-green-700'
    : 'bg-[#EF4E3D] hover:bg-red-700'
}`}
```

**Características**:
- **EXCEÇÃO**: Únicos botões que não usam scheme primary
- Verde para ações positivas: `bg-[#10A45C] hover:bg-green-700`
- Vermelho para ações destrutivas: `bg-[#EF4E3D] hover:bg-red-700`
- Sempre incluem animação de expansão: `hover:scale-105`

### 6. Botões de Seleção (Modal)
**Uso**: Botões dentro de modais para seleção de período, opções

```tsx
className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all duration-200 transform hover:scale-105 hover:text-white ${
  selected 
    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
    : 'bg-gray-700 text-white hover:bg-gray-600'
}`}
```

## 🎨 Classes CSS Utilitárias

### Classes Rápidas Disponíveis
Para implementação rápida, use as classes CSS pré-definidas:

```tsx
// Botão primário
<Button className="btn-primary h-11">
  <Icon className="h-4 w-4" />
  Text
</Button>

// Botão amarelo
<Button className="btn-yellow h-11">
  <Icon className="h-4 w-4" />
  Text  
</Button>

// Botão de copiar
<Button className="btn-copy" variant="ghost" size="sm">
  <Copy className="h-3 w-3" />
</Button>
```

### Definições CSS (`src/index.css:134-146`):
- `.btn-primary` - Esquema primary com animações
- `.btn-yellow` - Esquema amarelo com animações  
- `.btn-copy` - Botões pequenos de copiar

## 🎨 Componentes Padronizados

### Estrutura Base do Botão
Todos os botões seguem esta estrutura base:

```tsx
<Button className="[utility-class] [size-modifier]">
  <Icon className="h-4 w-4" />
  Text Content
</Button>
```

### Classes Base Obrigatórias
- `flex items-center gap-2` - Layout flexível com espaçamento
- `px-4 font-medium` - Padding horizontal e peso da fonte
- `transition-all duration-200 transform` - Transições suaves
- `hover:scale-105` ou `hover:scale-110` - Efeito de expansão
- `hover:text-white` - Texto branco no hover

## 📋 Checklist de Implementação

Ao criar ou atualizar botões, verificar:

- [ ] Inclui `transition-all duration-200 transform`
- [ ] Inclui efeito de escala (`hover:scale-105` ou `hover:scale-110`)
- [ ] Inclui `hover:text-white` (salvo exceções específicas)
- [ ] Usa `flex items-center gap-2` para layout
- [ ] Usa `px-4 font-medium` para spacing e typography
- [ ] Ícones com tamanho `h-4 w-4` (ou `h-3 w-3` para botões pequenos)

## 🎨 Esquema de Cores Padronizado

### Regra Principal
**TODOS os botões usam o esquema `primary`**, exceto:
- Botões de copiar (amarelo)
- Botões de estado dinâmico (verde/vermelho para ações críticas)

### Cores Padrão
- **Primary**: `bg-primary text-primary-foreground hover:bg-primary/90`
- **Copy**: `bg-yellow-400 text-black hover:bg-yellow-500` 
- **State Success**: `bg-[#10A45C] hover:bg-green-700`
- **State Destructive**: `bg-[#EF4E3D] hover:bg-red-700`

## 🔧 Manutenção

Este guia deve ser atualizado sempre que novos padrões de botões forem estabelecidos. Todos os botões do projeto devem seguir estes padrões para manter consistência visual e de experiência do usuário.

**Aplicado em**: `/infos`, `/assets`, `/graphs`  

---

**Última atualização**: Setembro 2025  
**Baseado em**: Padrões da página `/infos`