// import { instance } from '@/config/api'
// import { login } from '@/services/authService'

// // to-do: in the future, change the login logic to implement in firebase, without saving the data in the database to guarantee the login in fact

// jest.mock('@/config/api', () => ({
//   instance: {
//     post: jest.fn(),
//   },
// }))

// describe('authService', () => {
//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   describe('login', () => {
//     it('Given that the user provides valid login credentials, When the login function is called, Then the user should be logged in successfully and the response should match the expected user data.', async () => {
//       // Arrange
//       const mockResponse = {
//         user: {
//           uuid: '9ecfc98d-6313-444d-8d4e-1f171cd46fd8',
//           name: 'Vault demo',
//           email: 'vault@vault.com',
//           phone: null,
//           role: 'ADMIN',
//           createAt: '2024-07-19T21:56:40.461Z',
//           updateAt: '2024-07-19T21:56:40.461Z',
//           uuidOrganizations: 'e74e88e2-2185-42a8-8ae2-8013057ba7b8',
//         },
//       }

//       ;(instance.post as jest.Mock).mockResolvedValue({
//         data: mockResponse,
//       })

//       const email = 'vault@vault.com'
//       const password = '8lnq41ohHbGq'

//       // Act
//       const result = await login(email, password)

//       // Assert
//       expect(result).toEqual(mockResponse)
//       expect(instance.post).toHaveBeenCalledWith('auth/login', {
//         email,
//         password,
//       })
//     })

//     it('Given that the user provides invalid login credentials, When the login function is called, Then it should handle the login error and throw an appropriate error message.', async () => {
//       // Arrange
//       const email = 'test@example.com'
//       const password = 'wrongpassword'

//       ;(instance.post as jest.Mock).mockRejectedValue(new Error('Login failed'))

//       // Act & Assert
//       await expect(login(email, password)).rejects.toThrow('Login failed')
//     })
//   })
// })
