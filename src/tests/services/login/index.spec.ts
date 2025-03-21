import { setLogoutFunction, handleUnauthorized } from '../../../services/auth'

describe('auth service', () => {
  let mockLogoutFn: jest.Mock

  beforeEach(() => {
    mockLogoutFn = jest.fn()
    setLogoutFunction(mockLogoutFn)
  })

  it('should set the logout function', () => {
    const newMockFn = jest.fn()
    setLogoutFunction(newMockFn)
    handleUnauthorized()

    expect(typeof newMockFn).toBe('function')
    expect(newMockFn).toHaveBeenCalledWith({ returnTo: window.location.origin })
  })

  it('should call logout function with returnTo when handleUnauthorized is called', () => {
    handleUnauthorized()
    expect(mockLogoutFn).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    })
  })

  it('should not call logout function if it is not set', () => {
    setLogoutFunction(null)

    handleUnauthorized()

    expect(mockLogoutFn).not.toHaveBeenCalled()
  })
})
