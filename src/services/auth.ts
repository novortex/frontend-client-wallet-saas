// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logoutFn: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLogoutFunction = (fn: any) => {
  logoutFn = fn
}

export const handleUnauthorized = () => {
  if (logoutFn) {
    logoutFn({
      returnTo: window.location.origin,
    })
  }
}
