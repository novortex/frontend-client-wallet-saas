import { setLogoutFunction, handleUnauthorized, handleLogout, handleCompleteClearLogout, validateSession, isTokenExpired } from '../../../services/auth'

// Mock do window.location
const mockLocation = {
  origin: 'http://localhost',
  href: 'http://localhost'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock do sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
}

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
})

// Mock do fetch
global.fetch = jest.fn()

describe('auth service', () => {
  let mockLogoutFn: jest.Mock

  beforeEach(() => {
    mockLogoutFn = jest.fn()
    setLogoutFunction(mockLogoutFn)
    jest.clearAllMocks()
  })

  describe('setLogoutFunction', () => {
    it('should set the logout function', () => {
      const newMockFn = jest.fn()
      setLogoutFunction(newMockFn)
      handleLogout()

      expect(typeof newMockFn).toBe('function')
      expect(newMockFn).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    })

    it('should handle null logout function', () => {
      const emptyFn = jest.fn()
      setLogoutFunction(emptyFn)
      handleLogout()
      expect(mockLogoutFn).not.toHaveBeenCalled()
    })
  })

  describe('handleUnauthorized', () => {
    it('should store logout reason in sessionStorage', () => {
      handleUnauthorized()
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('logout_reason', 'unauthorized')
    })

    it('should redirect to Auth0 logout URL', () => {
      const mockAuth0Domain = 'test.auth0.com'
      const mockClientId = 'test-client-id'
      
      process.env.VITE_AUTH0_DOMAIN = mockAuth0Domain
      process.env.VITE_AUTH0_CLIENT_ID = mockClientId

      handleUnauthorized()
      
      const expectedUrl = `https://${mockAuth0Domain}/v2/logout?client_id=${mockClientId}&returnTo=${encodeURIComponent(window.location.origin)}`
      expect(window.location.href).toBe(expectedUrl)
    })
  })

  describe('handleLogout', () => {
    it('should call logout function with returnTo', async () => {
      const returnUrl = 'http://example.com'
      await handleLogout(returnUrl)
      expect(mockLogoutFn).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: returnUrl
        }
      })
    })

    it('should use window.location.origin as default returnTo', async () => {
      await handleLogout()
      expect(mockLogoutFn).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    })

    it('should clear local storage data', async () => {
      await handleLogout()
      expect(mockLocalStorage.removeItem).toHaveBeenCalled()
    })
  })

  describe('handleCompleteClearLogout', () => {
    it('should redirect to Auth0 logout URL', async () => {
      const mockAuth0Domain = 'test.auth0.com'
      const mockClientId = 'test-client-id'
      
      // Mock environment variables
      process.env.VITE_AUTH0_DOMAIN = mockAuth0Domain
      process.env.VITE_AUTH0_CLIENT_ID = mockClientId

      await handleCompleteClearLogout()
      
      const expectedUrl = `https://${mockAuth0Domain}/v2/logout?client_id=${mockClientId}&returnTo=${encodeURIComponent(window.location.origin)}`
      expect(window.location.href).toBe(expectedUrl)
    })
  })

  describe('token validation', () => {
    it('should return true for valid token', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Zv3wM5Hh9ZzQz8UY'
      expect(validateSession(validToken)).toBe(true)
    })

    it('should return false for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Zv3wM5Hh9ZzQz8UY'
      expect(validateSession(expiredToken)).toBe(false)
    })

    it('should return false for null token', () => {
      expect(validateSession(null)).toBe(false)
    })

    it('should return false for invalid token format', () => {
      expect(validateSession('invalid-token')).toBe(false)
    })
  })

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Zv3wM5Hh9ZzQz8UY'
      expect(isTokenExpired(expiredToken)).toBe(true)
    })

    it('should return false for valid token', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Zv3wM5Hh9ZzQz8UY'
      expect(isTokenExpired(validToken)).toBe(false)
    })

    it('should return true for invalid token format', () => {
      expect(isTokenExpired('invalid-token')).toBe(true)
    })
  })
})
