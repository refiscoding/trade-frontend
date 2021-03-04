import React, { Suspense } from 'react'
import { includes } from 'lodash'
import { Redirect, Route, RouteProps, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { FillLoader } from '../components'
import SideBar from '../components/SideBar'
import PageNotFound from '../containers/PageNotFound'
import { useAuthContext } from '../context/AuthProvider'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './routes'
import { NAV_ITEMS } from '../constants'

interface RouteType extends RouteProps {
  component: any
  title: string
}

const exemptedRoutes: string[] = ['/', '/product/:id', '/product-filter', '/category/:id']

const PrivateRoute = ({ component: Component, ...rest }: RouteType) => {
  const { isAuthenticating, isAuthenticated } = useAuthContext()

  if (isAuthenticating) {
    return <FillLoader />
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Suspense fallback={<FillLoader color="black" />}>
            <Component {...rest} />
          </Suspense>
        ) : includes(exemptedRoutes, rest?.path) ? (
          <Suspense fallback={<FillLoader color="black" />}>
            <Component {...rest} />
          </Suspense>
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

const PublicRoute = ({ component: Component, ...rest }: RouteType) => (
  <Route {...rest}>
    <Component />
  </Route>
)

const Navigation = () => (
  <Router>
    <Suspense fallback={<FillLoader />}>
      <Switch>
        {PUBLIC_ROUTES.map((route) => {
          return <PublicRoute key={route.path} {...route} />
        })}
        <Route
          path="/"
          render={() => (
            <SideBar
              bg="white"
              color="black"
              navItems={NAV_ITEMS}
              hoverColor="brand.50"
              accentColor="brand.500"
              closeOnNavigate
            >
              {PRIVATE_ROUTES.map((route) => {
                return <PrivateRoute key={route.path} {...route} />
              })}
            </SideBar>
          )}
        />
        <Route render={PageNotFound} />
      </Switch>
    </Suspense>
  </Router>
)

export default Navigation
