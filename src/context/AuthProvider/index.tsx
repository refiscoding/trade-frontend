import { isEqual } from 'lodash'
import * as React from 'react'
import { STRAPI_USER_STORAGE_KEY } from '../../constants'
import { UsersPermissionsUser } from '../../generated/graphql'
import { useBrowserStorage } from '../../hooks'
import strapiHelpers, { StrapiLoginPayload } from '../../utils/strapiHelpers'

type AuthProviderProps = {
  logout: () => void
  isAuthenticating: boolean
  isAuthenticated: boolean
  user: UsersPermissionsUser
  register: (email: string, password: string) => Promise<void>
  providerAuth: (provider: string, token: string) => Promise<void>
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<UsersPermissionsUser | undefined>>
}

const AuthContext = React.createContext<Partial<AuthProviderProps>>({})

export const useAuthContext = () => React.useContext(AuthContext)

type UserStorage = StrapiLoginPayload | null

const AuthProvider: React.FC = ({ children }) => {
  const [localUser, setLocalUser, removeLocalUser] = useBrowserStorage<UserStorage>(
    STRAPI_USER_STORAGE_KEY,
    'local'
  )

  const [sessionUser, setSessionUser, removeSessionUser] = useBrowserStorage<UserStorage>(
    STRAPI_USER_STORAGE_KEY,
    'session'
  )

  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)

  const [user, setUser] = React.useState(sessionUser?.user || localUser?.user)

  const persistUser = (data: StrapiLoginPayload, rememberMe?: boolean) => {
    rememberMe ? setLocalUser(data) : setSessionUser(data)
    setUser(data?.user)
  }

  const logout = () => {
    removeLocalUser()
    removeSessionUser()
    setIsAuthenticated(false)
    setUser(undefined)
  }

  React.useEffect(() => {
    if (user?.confirmed) {
      setIsAuthenticated(true)
      if (localUser?.user && !isEqual(localUser?.user, user)) {
        setLocalUser({ jwt: localUser.jwt, user })
      }
      if (sessionUser?.user && !isEqual(sessionUser?.user, user)) {
        setSessionUser({ jwt: sessionUser.jwt, user })
      }
    } else {
      setIsAuthenticated(false)
    }
    setIsAuthenticating(false)
    // eslint-disable-next-line
  }, [user])

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const { data } = await strapiHelpers.login(email, password)
      persistUser(data, rememberMe)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const { data } = await strapiHelpers.register(email, password)
      persistUser(data)
    } catch (error) {
      throw error
    }
  }

  const providerAuth = async (provider: string, token: string) => {
    try {
      const { data } = await strapiHelpers.providerAuth(provider, token)
      persistUser(data)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        providerAuth,
        isAuthenticated,
        isAuthenticating,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
