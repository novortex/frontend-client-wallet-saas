import { Grid3X3, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ViewMode = 'card' | 'table'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-border bg-background">
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className={`rounded-r-none border-r ${
          viewMode === 'card'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className={`rounded-l-none ${
          viewMode === 'table'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  )
}