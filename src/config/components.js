import Vue from 'vue';
import {
	Toast,
	Calendar,
	Cell,
}
	from 'vant';
const vantComponents = [
	Toast,
	Calendar,
	Cell,
]
// Vue.use(Calendar).use(Cell)
import {
	Form,
	Input,
	Button,
	Pagination,
	FormItem,
	Tabs,
	TabPane,
	Table,
	InputNumber,
	TableColumn,
	Checkbox,
	Dialog,
	Select,
	Option,
	Empty,
	DatePicker,
	Result,
	Image
} from 'element-ui'
Toast.allowMultiple();

const components = [
	Toast,
	Form,
	Tabs,
	TabPane,
	Table,
	TableColumn,
	Input,
	Pagination,
	InputNumber,
	Button,
	FormItem,
	Checkbox,
	Dialog,
	Select,
	Option,
	Empty,
	DatePicker,
	Result,
	Image
];

export default (Vue) => {
	components.forEach((Component) => {
		Vue.component(Component.name, Component);
	});
	vantComponents.forEach((Component) => {
		Vue.component(Component.name, Component);
	});
};
