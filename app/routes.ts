
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
			   file: "autos.tsx",
		   },
		],
	},
];

export default routes;
