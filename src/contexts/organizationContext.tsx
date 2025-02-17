import { createContext, useContext, useEffect, useState } from 'react';
import { Organization } from '@/types/organization.type';
import { useAuth0 } from '@auth0/auth0-react';
import { getOrganization } from '@/services/organizationService';

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (isAuthenticated && user) {
        const fetchOrganization = async () => {
        try {
            const orgData = await getOrganization();
            setOrganization(orgData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        };

        fetchOrganization();
    }
  }, []);

  return (
    <OrganizationContext.Provider value={{ organization, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
