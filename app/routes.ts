
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
				path: "presupuesto",
				file: "routes/presupuesto.tsx",
			},
			/*{
				path: "ordenCompra",
				file: "routes/ordenCompra.tsx",
			},*/
		],
	},
];

export default routes;
