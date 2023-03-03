import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Fragment, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hook';
import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';
import ClientLayout from './layouts/ClientLayout';
import { authRoutes, privateRoutes, publicRoutes } from './routes';
import { authFai, authPending, authSuccess } from './slices/authSlice';
import { selectMode } from './slices/globalSlice';
import { themeSettings } from './theme';
import JWTManager from './utils/jwt';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const theme = useMemo(() => createTheme(themeSettings(mode) as any), [mode]);

  // check login on start application
  useEffect(() => {
    const authenticate = async () => {
      dispatch(authPending());

      const token = JWTManager.getToken();
      if (token) {
        dispatch(authSuccess());
      } else {
        const success = await JWTManager.getRefreshToken();
        if (success) {
          dispatch(authSuccess());
        } else {
          dispatch(authFai());
        }
      }
    };

    authenticate();
  }, [dispatch]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route element={<AuthRoute />}>
              {authRoutes.map((route, index) => {
                const Page = route.component;

                let Layout = ClientLayout;

                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Route>

            {publicRoutes.map((route, index) => {
              const Page = route.component;

              let Layout = ClientLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            <Route element={<PrivateRoute />}>
              {privateRoutes.map((route, index) => {
                const Page = route.component;

                let Layout = ClientLayout;

                if (route.layout) {
                  Layout = route.layout;
                } else {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
