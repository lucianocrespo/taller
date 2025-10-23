import React from 'react';
import './Dashboard.css';

const today = new Date().toLocaleDateString();

const dashboardData = {
  turnosDelDia: 8,
  ventasDelMes: 12500,
  autosEnTaller: 5,
  clientesAtendidos: 23,
};

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Turnos del día</h2>
          <p>{dashboardData.turnosDelDia}</p>
        </div>
        <div className="dashboard-card">
          <h2>Ventas del mes</h2>
          <p>${dashboardData.ventasDelMes}</p>
        </div>
        <div className="dashboard-card">
          <h2>Autos en taller</h2>
          <p>{dashboardData.autosEnTaller}</p>
        </div>
        <div className="dashboard-card">
          <h2>Clientes atendidos hoy</h2>
          <p>{dashboardData.clientesAtendidos}</p>
        </div>
      </div>
      <div className="dashboard-date">Fecha: {today}</div>
    </div>
  );
}
