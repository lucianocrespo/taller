import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './layout.css';

export default function Layout() {
  return (
    <div className="layout-root">
      <aside className="sidebar">
        <h2 className="sidebar-title">Taller Mecánico</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/turnos">Turnos</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
            <li><Link to="/autos">Autos</Link></li>
            <li><Link to="/reparacion">Reparaciones</Link></li>
            <li><Link to="/compVenta">Comprobantes de Venta</Link></li>
            <li><Link to="/compPago">Comprobantes de Pago</Link></li>
            <li><Link to="/compCompra">Comprobantes de Compra</Link></li>
            <li><Link to="/presupuesto">Presupuestos</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-right">
            <Link to="/login" className="user-btn" title="Ingresar">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/></svg>
            </Link>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
