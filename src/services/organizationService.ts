import { instance } from '@/config/api';
import { Organization } from '@/types/organization.type';

export async function getOrganization(): Promise<Organization> {
  try {
    const response = await instance.get<Organization>(`organization`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw new Error('Failed to fetch organization details');
  }
}
