export default [{
		name: "index",
		path: "/index",
		component: resolve => require(["@/page/index.vue"], resolve),
		meta: {
			title: "主页",
			// requireAuth: true,
			// keepAlive: true,
		},
	}
];
