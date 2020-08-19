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
import Skeleton from 'react-loading-skeleton';

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';

class Header extends React.Component {
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
			daftarStaff: [],
			leave: 0
		};
	}

	componentDidMount() {
		this.getTotalAbsen();
		this.getTotalTerlambat();
		this.getTotalIzin();
		this.getTotalRequest();
		this.getTotalSakit();
		this.getTotalOvertime();
		this.getTotalStaff();
		this.getDaftarAbsen();
		this.getDaftarStaff();
		this.getTotalLeave();
	}

	getTotalStaff = () => {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.equalTo('leaderId', getLeaderId);
		query.notContainedIn('roles', [ 'admin', 'leader' ]);

		query
			.count()
			.then((x) => {
				this.setState({ totalStaff: x });
			})
			.catch((err) => {
				alert(err.message);
			});
	};

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
		query.equalTo('roles', 'staff');

		query
			.find({ useMasterKey: true })
			.then((x) => {
				this.setState({ daftarStaff: x });
			})
			.catch((err) => {});
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
				this.setState({ loading: false });
			});
	};

	getTotalAbsen = () => {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('leaderId', getLeaderId);

		query
			.count()
			.then((x) => {
				this.setState({ totalAbsen: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalTerlambat = () => {
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('leaderId', getLeaderId);

		query
			.count()
			.then((x) => {
				this.setState({ totalTerlambat: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalIzin = () => {
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('statusIzin', 2);
		query.equalTo('status', 3);
		query.equalTo('leaderId', getLeaderId);
		query
			.count()
			.then((x) => {
				this.setState({ totalIzin: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalSakit = () => {
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('leaderId', getLeaderId);
		query.equalTo('statusIzin', 1);
		query.equalTo('status', 3);
		query
			.count()
			.then((x) => {
				this.setState({ totalSakit: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalRequest = () => {
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.equalTo('statusApprove', 0);
		query.equalTo('leaderId', getLeaderId);
		query
			.count()
			.then((x) => {
				this.setState({ totalRequest: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalOvertime = () => {
		const Overtime = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Overtime);

		console.log('yesterday', moment().subtract(1, 'days').toDate());

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('leaderId', getLeaderId);
		query
			.count()
			.then((x) => {
				this.setState({ totalOvertime: x, loading: false });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				window.location.reload(false);
			});
	};

	getTotalLeave = () => {
		const Leave = Parse.Object.extend('EarlyLeave');
		const query = new Parse.Query(Leave);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.equalTo('leaderId', getLeaderId);
		query.equalTo('status', 3);
		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query
			.count()
			.then((x) => {
				this.setState({ leave: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	render() {
		const percentage = this.props.totalAbsen / this.props.totalStaff * 100;

		const { totalAbsen, totalIzin, totalOvertime, totalSakit, totalStaff, leave } = this.state;
		console.log(leave);

		return (
			<React.Fragment>
				<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
					<Container fluid>
						<div className="header-body">
							{/* Card stats */}
							<Row>
								<Col lg="6" xl="3">
									<Link to="/admin/absen" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Tepat waktu
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalAbsen / totalStaff == 1 ? (
																'Done'
															) : (
																`${totalAbsen} / ${totalStaff}`
															)}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-danger text-white rounded-circle shadow">
															<i className="fas fa-chart-bar" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="3">
									<Link to="/admin/request-cuti" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Cuti
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalIzin -
																(this.props.cuti
																	? this.props.cuti
																	: 0)}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-warning text-white rounded-circle shadow">
															<i className="fas fa-chart-pie" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="3">
									<Link to="/admin/request-izin" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Izin
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalSakit -
																(this.props.izin
																	? this.props.izin
																	: 0)}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
															<i className="fas fa-users" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="3">
									<Link to="/admin/request-lembur" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Overtime
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalOvertime} / {totalStaff}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-info text-white rounded-circle shadow">
															<i className="fas fa-percent" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
							</Row>
							<Row className="mt-4">
								<Col lg="6" xl="4">
									<Link to="/admin/request-pulang" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Request Pulang
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{leave -
																(this.props.leaveCounter
																	? this.props.leaveCounter
																	: 0)}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
															<i className="fas fa-chart-pie" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="4">
									<Link
										to="/admin/request-terlambat"
										style={{ color: 'inherit' }}
									>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Request Terlambat
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{this.state.totalTerlambat}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-primary text-white rounded-circle shadow">
															<i className="fas fa-users" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
								<Col lg="6" xl="4">
									<Link to="/admin/staff" style={{ color: 'inherit' }}>
										<Card className="card-stats mb-4 mb-xl-0">
											<CardBody>
												<Row>
													<div className="col">
														<CardTitle
															tag="h5"
															className="text-uppercase text-muted mb-0"
														>
															Total Staff
														</CardTitle>
														<span className="h2 font-weight-bold mb-0">
															{totalStaff}
														</span>
													</div>
													<Col className="col-auto">
														<div className="icon icon-shape bg-danger text-white rounded-circle shadow">
															<i className="fas fa-percent" />
														</div>
													</Col>
												</Row>
											</CardBody>
										</Card>
									</Link>
								</Col>
							</Row>
						</div>
					</Container>
				</div>
			</React.Fragment>
		);
	}
}

export default Header;
