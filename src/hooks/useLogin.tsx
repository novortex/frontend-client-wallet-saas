import { useUserStore } from '@/store/user';
import { login } from '@/services/authService';
import { toast } from '@/components/ui/use-toast';

export function useLogin() {
    const [setUser] = useUserStore((state) => [state.setUser]);

    const handleLogin = async (email: string, password: string) => {
        const result = await login(email, password);

        if (result) {
            setUser({
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                imageUrl: '',
                uuidOrganization: result.user.uuidOrganizations,
            });
            return { success: true };
        } else {
            toast({
                className: 'bg-red-500 border-0 text-white',
                title: 'Falha no login',
                description: 'Verifique suas credenciais e tente novamente.',
            });
            return { success: false };
        }
    };

    return { handleLogin };
};
