
import { type RouteConfig, index } from "@react-router/dev/routes";

const routes: RouteConfig = [
	{
		file: "layout.tsx",
		children: [
			index("dashboard/Dashboard.tsx"),
			{
				path: "welcome",
				file: "routes/home.tsx",
			},
			{
				path: "clientes",
				file: "routes/clientes.tsx",
			},
			{
			   path: "autos",
			   file: "routes/autos.tsx",
		   },
			{
				path: "turnos",
				file: "routes/turnos.tsx",
			},
			{
				path: "ventas",
				file: "routes/ventas.tsx",
			},
			{
				path: "reparacion",
				file: "routes/reparacion.tsx",
			},
			{
				path: "compVenta",
				file: "routes/compVenta.tsx",
			},
			{
				path: "compPago",
				file: "routes/compPago.tsx",
			},
			{
				path: "compCompra",
				file: "routes/compCompra.tsx",
			},
			{
				path: "presupuesto",
				file: "routes/presupuesto.tsx",
			},
			{
				path: "ordenCompra",
				file: "routes/ordenCompra.tsx",
			},
			{
				path: "ordenTrabajo",
				file: "routes/ordenTrabajo.tsx",
			},
			{
				path: "reclamoCliente",
				file: "routes/reclamoCliente.tsx",
			},
			{
				path: "reclamoProveedor",
				file: "routes/reclamoProveedor.tsx",
			},
			{
				path: "mecanicos",
				file: "routes/mecanicos.tsx",
			},
			{
				path: "proveedores",
				file: "routes/proveedores.tsx",
			},
			{
				path: "repuestos",
				file: "routes/repuestos.tsx",
			},
			{
				path: "servicios",
				file: "routes/servicios.tsx",
			},
			{
				path: "medioDePago",
				file: "routes/medioDePago.tsx",
			},
			{
				path: "modelosAuto",
				file: "routes/modelosAuto.tsx",
			},
			{
				path: "marcasAuto",
				file: "routes/marcasAuto.tsx",
			},
			{
				path: "tiposDocumento",
				file: "routes/tiposDocumento.tsx",
			},
			{
				path: "calles",
				file: "routes/calles.tsx",
			},
		],
	},
];

export default routes;
