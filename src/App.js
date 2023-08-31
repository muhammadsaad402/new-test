import React, { useEffect, useContext } from 'react';
import axios from 'axios'
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import useAlert from './hooks/useAlert';

import { GlobalContext } from './context/Context';
import { baseUrl } from './core';
// ----------------------------------------------------------------------

export default function App() {
  const { setAlert } = useAlert();
  const { dispatch } = useContext(GlobalContext);
  useEffect(() => {

    axios.get(`${baseUrl}/api/v1/admin/profile`, {
      withCredentials: true
    })
      .then((res) => {
        console.log("response", res.data)

        if (res.data.status) {

          dispatch({
            type: "USER_LOGIN",
            payload: {
              email: res.data.user.email,
              _id: res.data.user._id
            }
          })
        } else {
          dispatch({ type: "USER_LOGOUT" })
        }
      }).catch((error) => {
        dispatch({ type: "USER_LOGOUT" })
      })

    return () => {
    };
  }, [dispatch]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
