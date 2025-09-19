import { Input } from '@/components/ui/input'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCustomersOrganization } from '@/services/managementService'

interface ClientSearchProps {
  className?: string
}

export function ClientSearch({ className = "mb-6" }: ClientSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allCustomers, setAllCustomers] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Função para filtrar clientes baseado na pesquisa
  const filterCustomers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const filtered = allCustomers
      .filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 10) // Limite de 10 resultados

    setSearchResults(filtered)
    setShowDropdown(filtered.length > 0)
  }

  // Lidar com mudanças na pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setSelectedIndex(-1) // Reset selection
    filterCustomers(query)
  }

  // Lidar com navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleClientSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Navegar para a página do cliente selecionado
  const handleClientSelect = (client: any) => {
    if (client.walletUuid) {
      navigate(`/clients/${client.walletUuid}/infos`)
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  // Fechar dropdown quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  // Effect para carregar todos os clientes para pesquisa
  useEffect(() => {
    const loadAllCustomers = async () => {
      try {
        const customers = await getAllCustomersOrganization()
        setAllCustomers(customers || [])
      } catch (error) {
        console.error('Error loading customers for search:', error)
      }
    }

    loadAllCustomers()
  }, [])

  // Effect para lidar com cliques fora do dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={className}>
      <div className="relative">
        <Input
          ref={searchInputRef}
          className="h-12 border-2 border-border bg-background text-foreground transition-all placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-yellow-500/20"
          type="text"
          placeholder="Search for clients..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) setShowDropdown(true)
          }}
        />

        {/* Enhanced Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl"
          >
            {searchResults.map((client, index) => (
              <div
                key={client.uuid}
                className={`cursor-pointer border-b border-border px-4 py-3 text-sm transition-all duration-200 last:border-b-0 ${
                  index === selectedIndex
                    ? 'border-orange-500/20 bg-orange-500/10 text-orange-600'
                    : 'text-popover-foreground hover:bg-muted/50'
                }`}
                onClick={() => handleClientSelect(client)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium">{client.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {client.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}