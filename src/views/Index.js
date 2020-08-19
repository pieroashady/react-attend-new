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
import React from 'react';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// Parse library
import Parse from 'parse';
import moment from 'moment';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	NavItem,
	NavLink,
	Nav,
	Progress,
	Table,
	Container,
	Row,
	Col,
	Spinner
} from 'reactstrap';

// core components
import { chartOptions, parseOptions, chartExample1, chartExample2 } from 'variables/charts.js';

import Header from 'components/Headers/Header.js';
import { getUsername } from 'utils';
import { getLeaderId } from 'utils';
import { Link } from 'react-router-dom';

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeNav: 1,
			chartExample1Data: 'data1',
			totalAbsen: 0,
			totalTerlambat: 0,
			totalIzin: 0,
			totalSakit: 0,
			totalOvertime: 0,
			totalRequest: 0,
			percentage: {},
			loading: false,
			totalStaff: 0,
			absence: [],
			daftarStaff: []
		};
		if (window.Chart) {
			parseOptions(Chart, chartOptions());
		}
	}

	componentDidMount() {
		this.getDaftarAbsen();
		this.getDaftarStaff();
	}

	toggleNavs = (e, index) => {
		e.preventDefault();
		this.setState({
			activeNav: index,
			chartExample1Data: this.state.chartExample1Data === 'data1' ? 'data2' : 'data1'
		});
	};

	getDaftarStaff = () => {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.equalTo('leaderId', getLeaderId);
		query.notContainedIn('roles', [ 'admin', 'leader' ]);

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({ daftarStaff: x });
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	getDaftarAbsen = () => {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const Leader = Parse.Object.extend('Leader');
		const leader = new Leader();
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		console.log(Parse.User.current().get('leaderId').id);

		leader.id = Parse.User.current().get('leaderId').id;
		query.equalTo('leaderId', leader);
		query.ascending('absenMasuk');
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.include('user');
		query
			.find()
			.then((x) => {
				console.log('user', x);
				this.setState({ absence: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	render() {
		const { absence, loading, daftarStaff } = this.state;

		return (
			<React.Fragment>
				<Header />
				{/* Page content */}
				<Container className="mt--7" fluid>
					<Row>
						<Col className="mb-5 mb-xl-0" xl="8">
							<Card className="bg-gradient-default shadow">
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<div className="col">
											<h6 className="text-uppercase text-light ls-1 mb-1">
												Overview
											</h6>
											<h2 className="text-white mb-0">Ketepatan waktu</h2>
										</div>
										<div className="col">
											<Nav className="justify-content-end" pills>
												<NavItem>
													<NavLink
														className={classnames('py-2 px-3', {
															active: this.state.activeNav === 1
														})}
														href="#pablo"
														onClick={(e) => this.toggleNavs(e, 1)}
													>
														<span className="d-none d-md-block">
															Month
														</span>
														<span className="d-md-none">M</span>
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														className={classnames('py-2 px-3', {
															active: this.state.activeNav === 2
														})}
														data-toggle="tab"
														href="#pablo"
														onClick={(e) => this.toggleNavs(e, 2)}
													>
														<span className="d-none d-md-block">
															Week
														</span>
														<span className="d-md-none">W</span>
													</NavLink>
												</NavItem>
											</Nav>
										</div>
									</Row>
								</CardHeader>
								<CardBody>
									{/* Chart */}
									<div className="chart">
										<Line
											data={chartExample1[this.state.chartExample1Data]}
											options={chartExample1.options}
											getDatasetAtEvent={(e) => console.log(e)}
										/>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col xl="4">
							<Card className="shadow">
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<div className="col">
											<h6 className="text-uppercase text-muted ls-1 mb-1">
												Performance
											</h6>
											<h2 className="mb-0">Total orders</h2>
										</div>
									</Row>
								</CardHeader>
								<CardBody>
									{/* Chart */}
									<div className="chart">
										<Bar
											data={chartExample2.data}
											options={chartExample2.options}
										/>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<Row className="mt-5">
						<Col className="mb-5 mb-xl-0" xl="8">
							<Card className="shadow">
								<CardHeader className="border-0">
									<Row className="align-items-center">
										<div className="col">
											<h3 className="mb-0">Absen hari ini</h3>
										</div>
										<div className="col text-right">
											<Button
												color="primary"
												href="#pablo"
												onClick={(e) => e.preventDefault()}
												size="sm"
											>
												See all
											</Button>
										</div>
									</Row>
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Absen Masuk</th>
											<th scope="col">Absen Keluar</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>
											</td>
										) : absence.length < 1 ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											absence.map((prop, key) => (
												<tr>
													<td>{key + 1}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('absenMasuk')}</td>
													<td>{prop.get('absenKeluar')}</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
						</Col>
						<Col xl="4">
							<Card className="shadow">
								<CardHeader className="border-0">
									<Row className="align-items-center">
										<div className="col">
											<h3 className="mb-0">Staff saya</h3>
										</div>
										<div className="col text-right">
											<Link to="/admin/staff">
												<Button color="primary" size="sm">
													See all
												</Button>
											</Link>
										</div>
									</Row>
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Sisa cuti</th>
											<th scope="col">Email</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>
											</td>
										) : daftarStaff.length < 1 ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											daftarStaff.map((prop, key) => (
												<tr>
													<td>{prop.get('nik')}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('jumlahCuti')}</td>
													<td>{prop.get('email')}</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
						</Col>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default Index;
