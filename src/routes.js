/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from 'views/Index.js';
import Profile from 'views/examples/Profile.js';
import Maps from 'views/examples/Maps.js';
import Register from 'views/examples/Register.js';
import Login from 'views/examples/Login.js';
import Tables from 'views/examples/Tables.js';
import Icons from 'views/examples/Icons.js';
import Cuti from 'views/examples/Cuti';
import Izin from 'views/examples/Izin';
import PulangCepat from 'views/examples/PulangCepat';
import Lembur from 'views/examples/Lembur';
import Terlambat from 'views/examples/Terlambat';
import ChangeRequest from 'views/examples/ChangeRequest';
import StatusRequest from 'views/examples/StatusRequest';
import ViewHistory from 'views/examples/ViewHistory';

var routes = [
	{
		path: '/index',
		name: 'Dashboard',
		icon: 'ni ni-tv-2 text-primary',
		component: Index,
		layout: '/admin'
	},
	{
		path: '/staff',
		name: 'Staff',
		icon: 'ni ni-single-02 text-yellow',
		component: Profile,
		layout: '/admin'
	},
	{
		path: '/data-absen',
		name: 'Absen',
		icon: 'ni ni-bullet-list-67 text-red',
		component: Tables,
		layout: '/admin'
	},
	{
		path: '/request-cuti',
		name: 'Request Cuti',
		icon: 'ni ni-key-25 text-info',
		component: Cuti,
		layout: '/admin'
	},
	{
		path: '/request-izin',
		name: 'Request Izin',
		icon: 'ni ni-spaceship text-warning',
		component: Izin,
		layout: '/admin'
	},
	{
		path: '/request-pulang',
		name: 'Request Pulang',
		icon: 'ni ni-watch-time text-primary',
		component: PulangCepat,
		layout: '/admin'
	},
	{
		path: '/request-lembur',
		name: 'Request Lembur',
		icon: 'ni ni-time-alarm text-yellow',
		component: Lembur,
		layout: '/admin'
	},
	{
		path: '/request-terlambat',
		name: 'Request Terlambat',
		icon: 'ni ni-user-run text-danger',
		component: Terlambat,
		layout: '/admin'
	},
	{
		path: '/change-request',
		name: 'Change Request',
		icon: 'ni ni-archive-2 text-info',
		component: ChangeRequest,
		layout: '/admin'
	},
	{
		path: '/status-request',
		name: 'Status Request',
		icon: 'ni ni-archive-2 text-danger',
		component: StatusRequest,
		layout: '/admin'
	},
	{
		path: '/view-history/:id',
		name: 'History',
		icon: 'ni ni-user-run text-primary',
		component: ViewHistory,
		layout: '/admin',
		invisible: true
	},
	{
		path: '/register',
		name: 'Register',
		icon: 'ni ni-circle-08 text-pink',
		component: Register,
		layout: '/auth'
	},
	{
		path: '/login',
		name: 'Login',
		icon: 'ni ni-circle-08 text-pink',
		component: Login,
		layout: '/auth',
		invisible: true
	}
];
export default routes;
