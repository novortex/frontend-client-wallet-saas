import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { Header } from './Header'
import { BaseWallet } from '@/types/baseWallet.type'
import { getBaseWallets, updateBaseWallet } from '@/services/baseWalletService'
import { getAllAssetsOrg } from '@/services/managementService'
import { TAssetsOrganizationResponse } from '@/types/response.type'
import { Loading } from '@/components/custom/loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import { createBaseWalletColumns } from './columns'
import { BaseWalletTarget } from '@/types/baseWallet.type'
import EditAllocationModal from './edit-allocation-modal'
import AddAssetModal from './add-asset-modal'
import DeleteBaseWalletModal from './delete-base-wallet-modal'
import DeleteAssetModal from './delete-asset-modal'
import ApplyToAllWalletsModal from './apply-to-all-wallets-modal'
import { Trash2, Plus, CheckCheck } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'

const getRiskProfileDisplayName = (riskProfile: string) => {
  const profiles: Record<string, string> = {
    SUPER_LOW_RISK: 'Super Baixo Risco',
    LOW_RISK: 'Baixo Risco',
    STANDARD: 'Risco Padrão',
    HIGH_RISK: 'Alto Risco',
    SUPER_HIGH_RISK: 'Super Alto Risco',
  }
  return profiles[riskProfile] || riskProfile
}

const getAssetTicker = (assetName: string) => {
  // Extract ticker from asset name (usually the first word or abbreviation)
  const words = assetName.split(' ')
  return words[0] || assetName
}

export function BaseWalletDetail() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [baseWallet, setBaseWallet] = useState<BaseWallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [editingTarget, setEditingTarget] = useState<BaseWalletTarget | null>(null)
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingAsset, setDeletingAsset] = useState<BaseWalletTarget | null>(null)
  const [isApplyToAllModalOpen, setIsApplyToAllModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [assets, setAssets] = useState<TAssetsOrganizationResponse[]>([])

  const handleEditAllocation = (target: BaseWalletTarget) => {
    try {
      console.log('Editing allocation for target:', target)
      if (!target) {
        console.error('Target is null or undefined')
        return
      }
      setEditingTarget(target)
    } catch (error) {
      console.error('Error in handleEditAllocation:', error)
      toast({
        className: 'toast-error',
        title: 'Erro',
        description: 'Erro ao abrir modal de alocação.',
        duration: 6000,
      })
    }
  }

  const handleDeleteAsset = (target: BaseWalletTarget) => {
    try {
      console.log('Deleting asset:', target)
      if (!target) {
        console.error('Target is null or undefined')
        return
      }
      setDeletingAsset(target)
    } catch (error) {
      console.error('Error in handleDeleteAsset:', error)
      toast({
        className: 'toast-error',
        title: 'Erro',
        description: 'Erro ao abrir modal de remoção.',
        duration: 6000,
      })
    }
  }

  // Enrich target assets with full asset data (including icons and price)
  const enrichedTargetAssets = useMemo(() => {
    return (baseWallet?.TargetAssets || []).map(target => {
      const fullAsset = assets.find(asset => asset.uuid === target.assetUuid)
      return {
        ...target,
        asset: fullAsset ? {
          name: fullAsset.name,
          symbol: getAssetTicker(fullAsset.name),
          icon: fullAsset.icon,
          price: fullAsset.price
        } : target.asset
      }
    })
  }, [baseWallet?.TargetAssets, assets])

  const table = useReactTable({
    data: enrichedTargetAssets,
    columns: createBaseWalletColumns(handleEditAllocation, handleDeleteAsset),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) return
      
      try {
        setLoading(true)
        const [baseWallets, assetsData] = await Promise.all([
          getBaseWallets(),
          getAllAssetsOrg()
        ])
        
        const foundWallet = baseWallets.find((wallet) => wallet.uuid === uuid)
        
        if (!foundWallet) {
          toast({
            className: 'toast-error',
            title: 'Erro',
            description: 'Carteira padrão não encontrada.',
            duration: 6000,
          })
          navigate('/base-wallets')
          return
        }
        
        setBaseWallet(foundWallet)
        if (assetsData && Array.isArray(assetsData)) {
          setAssets(assetsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          className: 'toast-error',
          title: 'Erro',
          description: 'Falha ao carregar carteira padrão.',
          duration: 6000,
        })
        navigate('/base-wallets')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [uuid, navigate])

  if (loading) return <Loading />
  if (!baseWallet) return null

  const totalAllocation = baseWallet.TargetAssets?.reduce(
    (sum, target) => sum + target.idealAllocation,
    0,
  ) || 0

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <Header 
          baseWalletUuid={uuid} 
          baseWalletName={baseWallet.name}
        />
        
        <div className="mb-6 flex items-center gap-4">
          <Input
            className="flex-1 border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="Buscar por nome ou perfil de risco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Button 
            className="btn-green"
            onClick={() => setIsApplyToAllModalOpen(true)}
          >
            <CheckCheck size={16} />
            Aplicar em Todas
          </Button>
          
          <Button 
            className="btn-red"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={16} />
            Excluir
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{baseWallet.name}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Perfil de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{getRiskProfileDisplayName(baseWallet.riskProfile)}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{baseWallet.TargetAssets?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alocação Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-semibold ${
                totalAllocation === 100 ? 'text-green-600' : 'text-[#EF4E3D]'
              }`}>
                {totalAllocation.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alocações de Ativos</CardTitle>
              <Button 
                className="btn-yellow"
                size="sm"
                onClick={() => setIsAddAssetModalOpen(true)}
              >
                <Plus size={16} />
                Adicionar Ativo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow 
                      key={headerGroup.id}
                      className="border bg-gray-200 dark:bg-[#131313] dark:hover:bg-[#131313]"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id}
                          className="text-black dark:text-white py-4"
                        >
                          {!header.isPlaceholder &&
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="border bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6] dark:hover:bg-[#171717]">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow 
                        key={row.id}
                        className="hover:bg-gray-200 dark:hover:bg-[#131313]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        Nenhum ativo configurado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <EditAllocationModal
        isOpen={!!editingTarget}
        onClose={() => setEditingTarget(null)}
        target={editingTarget}
        onSave={async (newAllocation) => {
          if (!editingTarget || !baseWallet) return
          
          try {
            // Update the specific target with new allocation
            const updatedTargets = baseWallet.TargetAssets.map(target => {
              if (target.cuid === editingTarget.cuid || target.assetUuid === editingTarget.assetUuid) {
                return {
                  cuid: target.cuid,
                  assetUuid: target.assetUuid,
                  idealAllocation: newAllocation
                }
              }
              return {
                cuid: target.cuid,
                assetUuid: target.assetUuid,
                idealAllocation: target.idealAllocation
              }
            })
            
            // Call API to update base wallet
            await updateBaseWallet(baseWallet.uuid, {
              targets: updatedTargets
            })
            
            // Refresh data
            const baseWallets = await getBaseWallets()
            const updatedWallet = baseWallets.find((wallet) => wallet.uuid === uuid)
            if (updatedWallet) {
              setBaseWallet(updatedWallet)
            }
            
            toast({
              className: 'toast-success',
              title: 'Sucesso!',
              description: 'Alocação atualizada com sucesso.',
              duration: 4000,
            })
            
            setEditingTarget(null)
          } catch (error) {
            console.error('Error updating allocation:', error)
            toast({
              className: 'toast-error',
              title: 'Erro',
              description: 'Falha ao atualizar alocação. Tente novamente.',
              duration: 6000,
            })
          }
        }}
      />
      
      <AddAssetModal
        isOpen={isAddAssetModalOpen}
        onClose={() => setIsAddAssetModalOpen(false)}
        baseWallet={baseWallet}
        onSuccess={async () => {
          // Refresh data after adding asset
          const baseWallets = await getBaseWallets()
          const updatedWallet = baseWallets.find((wallet) => wallet.uuid === uuid)
          if (updatedWallet) {
            setBaseWallet(updatedWallet)
          }
          
          // Refresh assets list
          const assetsData = await getAllAssetsOrg()
          if (assetsData && Array.isArray(assetsData)) {
            setAssets(assetsData)
          }
        }}
      />
      
      {baseWallet && (
        <DeleteBaseWalletModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          baseWalletName={baseWallet.name}
          baseWalletUuid={baseWallet.uuid}
          onSuccess={() => {
            navigate('/base-wallets')
          }}
        />
      )}
      
      {baseWallet && (
        <ApplyToAllWalletsModal
          isOpen={isApplyToAllModalOpen}
          onClose={() => setIsApplyToAllModalOpen(false)}
          baseWalletName={baseWallet.name}
          riskProfile={baseWallet.riskProfile}
          onSuccess={() => {
            // Optionally refresh data or show success message
          }}
        />
      )}
      
      <DeleteAssetModal
        isOpen={!!deletingAsset}
        onClose={() => setDeletingAsset(null)}
        target={deletingAsset}
        baseWalletUuid={baseWallet.uuid}
        onSuccess={async () => {
          // Refresh data after deleting asset
          const baseWallets = await getBaseWallets()
          const updatedWallet = baseWallets.find((wallet) => wallet.uuid === uuid)
          if (updatedWallet) {
            setBaseWallet(updatedWallet)
          }
          
          // Refresh assets list
          const assetsData = await getAllAssetsOrg()
          if (assetsData && Array.isArray(assetsData)) {
            setAssets(assetsData)
          }
        }}
      />
    </div>
  )
}