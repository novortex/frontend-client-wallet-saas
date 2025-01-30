import { useToast } from '@/components/ui/use-toast'

export function useValidation() {
  const { toast } = useToast()

  const validateInputs = (entryValue?: string, allocation?: string) => {
    let isValid = true

    if (!entryValue || Number(entryValue) < 0) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Validation Error',
        description: 'Entry value cannot be negative',
      })
      isValid = false
    }

    const allocationValue = Number(allocation)
    if (!allocation || allocationValue < 0 || allocationValue > 100) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Validation Error',
        description: 'Allocation must be between 0 and 100',
      })
      isValid = false
    }

    return isValid
  }

  return { validateInputs }
}
