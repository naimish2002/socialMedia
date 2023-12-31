import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRouter = () => {
  const firstLogin = localStorage.getItem('firstLogin');
  return <>{firstLogin ? <Outlet /> : <Navigate to='/login' />}</>;
};

export default PrivateRouter;
