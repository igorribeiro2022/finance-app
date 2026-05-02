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
import Perfil from '../pages/Perfil';
import Seguranca from '../pages/Seguranca';
import AuthCallback from '../pages/AuthCallback';
import Onboarding from '../pages/Onboarding';
import RecuperarSenha from '../pages/RecuperarSenha';
import RedefinirSenha from '../pages/RedefinirSenha';
import ConviteCasa from '../pages/ConviteCasa';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';


function PublicOnlyRoute({ children }) {
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated =
    !!auth.isAuthenticated || !!auth.accessToken || !!auth.user;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}


function PrivateLayout() {
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated =
    !!auth.isAuthenticated || !!auth.accessToken || !!auth.user;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
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

      <Route
        path="/recuperar-senha"
        element={
          <PublicOnlyRoute>
            <RecuperarSenha />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/redefinir-senha/:uid/:token"
        element={
          <PublicOnlyRoute>
            <RedefinirSenha />
          </PublicOnlyRoute>
        }
      />

      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/convite-casa/:token" element={<ConviteCasa />} />

      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/categorias" element={<Navigate to="/perfil?secao=categorias" replace />} />
        <Route path="/preferencias" element={<Navigate to="/perfil?secao=preferencias" replace />} />
        <Route path="/seguranca" element={<Seguranca />} />
        <Route path="/membros-casa" element={<Casa initialTab="membros" />} />
        <Route path="/gastos-fixos" element={<GastosFixos />} />
        <Route path="/ganhos-fixos" element={<GanhosFixos />} />
        <Route path="/eventuais" element={<Eventuais />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/vista-bancaria" element={<VistaBancaria />} />
        <Route path="/casa" element={<Casa />} />
        <Route path="/open-finance" element={<OpenFinance />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


export default AppRoutes;
