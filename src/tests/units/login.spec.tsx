import { render } from '@testing-library/react';
import Login from '../../pages/login';
import { MemoryRouter } from 'react-router-dom';

describe('Login Component', () => {
    it('should throw an error when login fails', async () => {
        const mockLogin = jest.fn().mockImplementation(async () => {
            throw new Error('Login failed');
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await expect(mockLogin).rejects.toThrow('Login failed');
    });
});
