import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '../components/Layout';

import Dashboard from '../pages/Dashboard';
import GastosFixos from '../pages/GastosFixos';
import GanhosFixos from '../pages/GanhosFixos';
import Eventuais from '../pages/Eventuais';
import Calendario from '../pages/Calendario';
import VistaBancaria from '../pages/VistaBancaria';
import Casa from '../pages/Casa';
import OpenFinance from '../pages/OpenFinance';
import Categorias from '../pages/Categorias';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';

function PrivateRoute() {
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated =
    !!auth.isAuthenticated || !!auth.accessToken || !!auth.user;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated =
    !!auth.isAuthenticated || !!auth.accessToken || !!auth.user;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function PrivateLayout() {
  return (
    <PrivateRoute>
      <Layout>
        <Outlet />
      </Layout>
    </PrivateRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/cadastro"
        element={
          <PublicOnlyRoute>
            <Cadastro />
          </PublicOnlyRoute>
        }
      />

      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/gastos-fixos" element={<GastosFixos />} />
        <Route path="/ganhos-fixos" element={<GanhosFixos />} />
        <Route path="/eventuais" element={<Eventuais />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/vista-bancaria" element={<VistaBancaria />} />
        <Route path="/casa" element={<Casa />} />
        <Route path="/open-finance" element={<OpenFinance />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;