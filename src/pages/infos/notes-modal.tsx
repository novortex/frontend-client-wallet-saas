import { useState, useEffect, useRef, Fragment, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  initialNotes?: string
  onSave?: (notes: string) => Promise<void> | void
}

// Helper function to decode HTML entities for display
function decodeHtmlEntities(text: string): string {
  if (!text) return text

  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Lightweight safety checker: only considers REAL angle-bracket tags dangerous.
// Plain words ("script de teste", "usar iframe para...") are allowed.
// Encoded entities (&lt;script&gt;) are treated as plain text and allowed.
const isTextSafe = (content: string): boolean => {
  if (!content || typeof content !== 'string') return true
  const tagNameGroup = '(script|iframe|object|embed|form|input|meta)'
  // Real tags like <script ...> or </script>
  const realTag = new RegExp(`<\\/?\\s*${tagNameGroup}\\b`, 'i')
  // Event handlers only matter inside a tag
  const inlineHandler = /<[^>]*\bon\w+\s*=/i
  // javascript: only dangerous when part of an attribute inside a tag
  const jsProtoInAttr = /<[^>]*=(?:"|')\s*javascript:/i
  return !(
    realTag.test(content) ||
    inlineHandler.test(content) ||
    jsProtoInAttr.test(content)
  )
}

export function NotesModal({
  isOpen,
  onClose,
  customerName,
  initialNotes = '',
  onSave,
}: NotesModalProps) {
  // Definição de seções (cabeçalhos fixos) - label amigável + heading interno markdown para manter compat
  const sectionDefsRef = useRef([
    {
      heading: '**Tempo de Mercado**',
      label: 'Tempo de Mercado',
      placeholder:
        'Ex: Investidor desde 2018, começou com renda fixa e migrou para cripto em 2021...',
    },
    {
      heading: '**Nível de Conhecimento**',
      label: 'Nível de Conhecimento',
      placeholder:
        'Ex: Intermediário em análise técnica, básico em derivativos, alta familiaridade com exchanges...',
    },
    {
      heading: '**Fontes de Informação**',
      label: 'Fontes de Informação',
      placeholder:
        'Ex: Relatórios internos, Twitter (contas X, Y), Glassnode, canais do YouTube...',
    },
    {
      heading: '**Motivação Principal**',
      label: 'Motivação Principal',
      placeholder:
        'Ex: Aposentadoria antecipada, preservação patrimonial, diversificação internacional...',
    },
    {
      heading: '**Horizonte Temporal**',
      label: 'Horizonte Temporal',
      placeholder:
        'Ex: Curto prazo para parte tática, foco principal 5-10 anos...',
    },
    {
      heading: '**Especificações**',
      label: 'Especificações',
      placeholder:
        'Ex: Não operar alavancado, evitar exposição a NFTs, máximo de 15% em altcoins...',
    },
  ] as const)
  const headingsRef = useRef<string[]>(
    sectionDefsRef.current.map((s) => s.heading),
  )

  // Constrói o template inicial com linhas em branco entre seções
  const buildTemplate = (h: string[]) =>
    h
      .map((head) => `${head}\n`)
      .join('\n')
      .trimEnd()

  const templateRef = useRef(buildTemplate(headingsRef.current))

  // Estado por seção para melhor usabilidade
  const [sections, setSections] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)
  const [isContentSafe, setIsContentSafe] = useState(true)
  const [contentWarning, setContentWarning] = useState('')
  const { toast } = useToast()
  const originalNotesRef = useRef('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  // estado de controle global de expansão removido (accordion simples)
  // (textareaRef removido; edição agora é por seção)

  // Serializa seções com: Heading sozinho na linha, corpo abaixo, linha em branco entre seções
  const serializeSections = (map: Record<string, string>) => {
    const order = headingsRef.current
    return order
      .map((h) => {
        const body = (map[h] || '').trimEnd()
        return body ? `${h}\n${body}` : `${h}`
      })
      .join('\n\n')
      .trimEnd()
  }

  // Faz parse de notas existentes (modelo antigo monolítico) para novo mapa
  const parseExistingNotes = (raw: string): Record<string, string> => {
    const map: Record<string, string> = {}
    const heads = headingsRef.current
    heads.forEach((h) => (map[h] = ''))
    if (!raw || !raw.trim()) return map

    // Normaliza quebras
    let normalized = raw.replace(/\r\n?/g, '\n')

    // Garante quebra antes e depois de cada heading (caso venham colados)
    const escaped = heads.map((h) => h.replace(/\*/g, '\\*'))
    const headingRegex = new RegExp(`(${escaped.join('|')})`, 'g')
    normalized = normalized.replace(headingRegex, '\n$1\n')

    // Remove duplicadas excessivas
    normalized = normalized.replace(/\n{2,}/g, '\n')

    const rawLines = normalized.split('\n')
    const headingSet = new Set(heads)
    let current: string | null = null

    for (const line of rawLines) {
      if (!line) continue
      // Se a linha contém um heading colado com texto (ex: **Tempo**30 anos)
      const match = heads.find((h) => line.startsWith(h))
      if (match) {
        current = match
        const remainder = line.slice(match.length).trim()
        if (remainder) {
          map[current] += (map[current] ? '\n' : '') + remainder
        }
        continue
      }
      if (current && !headingSet.has(line)) {
        map[current] += (map[current] ? '\n' : '') + line
      }
    }
    return map
  }

  useEffect(() => {
    if (isOpen) {
      const raw = decodeHtmlEntities(initialNotes || '')
      const parsed = parseExistingNotes(raw)
      setSections(parsed)
      const serialized = serializeSections(parsed)
      setNotes(serialized || templateRef.current)
      originalNotesRef.current = serialized || templateRef.current
      validateContent(serialized || templateRef.current)
      const initialCollapsed: Record<string, boolean> = {}
      sectionDefsRef.current.forEach(
        (s) => (initialCollapsed[s.heading] = true), // inicia tudo fechado
      )
      setCollapsed(initialCollapsed)
    }
  }, [isOpen, initialNotes])

  // Validate content in real-time (tag-focused, evita falso positivo em frases tipo "script de teste")
  const validateContent = (content: string) => {
    const tagNameGroup = '(script|iframe|object|embed|form|input|meta)'
    const hasRealTag = new RegExp(`<\\/?\\s*${tagNameGroup}\\b`, 'i').test(
      content,
    )
    const obfuscatedScript = /<\s*s\s*c\s*r\s*i\s*p\s*t/i.test(content) // raríssimo, mas mantido
    const inlineHandler = /<[^>]*\bon\w+\s*=/i.test(content)
    const jsProtoInAttr = /<[^>]*=(?:"|')\s*javascript:/i.test(content)

    const safe = isTextSafe(content)

    setIsContentSafe(safe)

    if (!safe) {
      setContentWarning(
        hasRealTag
          ? 'Tag HTML não permitida detectada.'
          : obfuscatedScript
            ? 'Tag <script> ofuscada detectada.'
            : inlineHandler
              ? 'Atributo de evento inline (on*) detectado.'
              : jsProtoInAttr
                ? 'Uso de javascript: em atributo detectado.'
                : 'Conteúdo potencialmente inseguro.',
      )
    } else {
      setContentWarning('')
    }
    return safe
  }

  // Atualiza conteúdo de uma seção
  const updateSection = (heading: string, value: string) => {
    setSections((prev) => {
      const next = { ...prev, [heading]: value }
      const serialized = serializeSections(next)
      setNotes(serialized)
      validateContent(serialized)
      return next
    })
  }

  // Accordion: ao abrir uma seção, fecha as demais. Ao clicar numa já aberta, apenas fecha ela.
  const toggleSection = (heading: string) => {
    setCollapsed((prev) => {
      const isCurrentlyCollapsed = prev[heading]
      const next: Record<string, boolean> = { ...prev }
      if (isCurrentlyCollapsed) {
        // abrir -> fecha todas as outras
        headingsRef.current.forEach((h) => (next[h] = true))
        next[heading] = false
      } else {
        // fechar apenas esta
        next[heading] = true
      }
      return next
    })
  }

  // métricas globais removidas (poderão ser reintroduzidas numa barra de status se necessário)

  const autoGrow = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 400) + 'px' // limite razoável
  }, [])

  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await Promise.resolve(onSave(notes))
      toast({
        className: 'bg-green-500 border-0',
        title: 'Notes saved!',
        description: 'Client notes updated successfully.',
      })
      onClose()
    } catch (error) {
      const err = error as unknown as {
        response?: { data?: Record<string, unknown>; status?: number }
      }
      const data = (err?.response?.data as Record<string, unknown>) || {}
      const status = err?.response?.status
      const reason = typeof data.reason === 'string' ? data.reason : ''
      const code = typeof data.code === 'string' ? data.code : ''
      const errorKey = typeof data.error === 'string' ? data.error : ''
      const message = typeof data.message === 'string' ? data.message : ''
      const isMalicious =
        reason === 'XSS_DETECTED' ||
        code === 'INVALID_CONTENT' ||
        errorKey === 'MALICIOUS_CONTENT' ||
        /unsafe|malicious|xss/i.test(message) ||
        (status && [400, 422].includes(status) && !isTextSafe(notes))

      if (isMalicious) {
        const serverMsg: string =
          message || 'Potentially unsafe content detected and blocked.'
        const sanitizedContent =
          typeof data.sanitizedContent === 'string' ? data.sanitizedContent : ''
        const sanitizedAlt =
          typeof data.sanitized === 'string' ? data.sanitized : ''
        const sanitized: string = sanitizedContent || sanitizedAlt

        // Update local state with sanitized content if available
        if (sanitized) {
          setNotes(decodeHtmlEntities(sanitized))
        }

        const preview = notes
          .replace(/\s+/g, ' ')
          .slice(0, 160)
          .concat(notes.length > 160 ? '…' : '')

        toast({
          className:
            'border-0 bg-amber-500 text-black dark:bg-amber-400 dark:text-black',
          title: 'Unsafe content blocked',
          description: (
            <div className="space-y-2 text-xs">
              <p className="text-sm font-medium leading-snug">{serverMsg}</p>
              <div className="rounded bg-black/10 p-2 dark:bg-black/20">
                <span className="font-semibold">Attempted:</span> {preview}
              </div>
              {sanitized && (
                <div className="rounded bg-black/10 p-2 dark:bg-black/20">
                  <span className="font-semibold">Sanitized stored:</span>{' '}
                  {sanitized.slice(0, 160)}
                  {sanitized.length > 160 ? '…' : ''}
                </div>
              )}
              <p className="leading-snug text-muted-foreground">
                Please remove script / HTML tags and try saving again.
              </p>
            </div>
          ),
        })
      } else {
        toast({
          className: 'bg-red-500 border-0',
          title: 'Save error',
          description: message || 'Could not save notes. Please try again.',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const attemptClose = () => {
    if (notes !== originalNotesRef.current) {
      setShowUnsavedConfirm(true)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && attemptClose()}>
      <DialogContent className="mx-auto w-full max-w-2xl border-0 dark:bg-[#1C1C1C] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-white">
            Client Notes - {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {sectionDefsRef.current.map((s, idx) => {
            const h = s.heading
            const collapsedState = collapsed[h]
            const value = sections[h] || ''
            const charCount = value.length
            return (
              <Fragment key={h}>
                <div
                  className={`group rounded-lg border border-border bg-background/60 shadow-sm transition dark:border-[#323232] dark:bg-[#1a1a1a] ${
                    collapsedState ? 'opacity-75' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(h)}
                    className="flex w-full items-center justify-between gap-4 rounded-t-lg px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[11px] font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold tracking-wide text-foreground dark:text-white md:text-base">
                        {s.label}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Seção fixa
                      </span>
                      <span
                        className={`transition ${collapsedState ? 'rotate-180' : ''}`}
                      >
                        ▼
                      </span>
                    </div>
                  </button>
                  {!collapsedState && (
                    <div className="border-t border-border px-4 pb-4 pt-3 dark:border-[#323232]">
                      <textarea
                        ref={autoGrow}
                        value={value}
                        onChange={(e) => {
                          updateSection(h, e.target.value)
                          autoGrow(e.target)
                        }}
                        placeholder={s.placeholder}
                        className={`max-h-[400px] w-full resize-none rounded-md border bg-background/70 p-3 text-sm leading-relaxed outline-none transition focus:ring-2 dark:bg-[#131313] dark:text-white ${
                          !isContentSafe
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-border focus:border-primary focus:ring-primary/20 dark:border-[#323232]'
                        }`}
                      />
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{charCount} caracteres</span>
                        {charCount > 0 && (
                          <button
                            type="button"
                            onClick={() => updateSection(h, '')}
                            className="rounded px-2 py-0.5 font-medium text-muted-foreground/70 transition hover:bg-muted hover:text-foreground dark:hover:bg-[#202020]"
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            )
          })}
          {contentWarning && (
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ {contentWarning}
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={attemptClose}
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !isContentSafe}
            className="btn-yellow"
          >
            {isSaving
              ? 'Saving...'
              : !isContentSafe
                ? 'Content Blocked'
                : 'Save Notes'}
          </Button>
        </DialogFooter>

        {showUnsavedConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-lg border border-border bg-popover p-5 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold text-popover-foreground">
                Discard changes?
              </h4>
              <p className="mb-5 text-sm text-muted-foreground">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUnsavedConfirm(false)}
                  className="border-border bg-background text-foreground hover:bg-muted dark:border-[#323232] dark:bg-[#131313] dark:text-white dark:hover:bg-[#171717]"
                >
                  Back
                </Button>
                <Button
                  className="btn-yellow"
                  onClick={() => {
                    setShowUnsavedConfirm(false)
                    onClose()
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
