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

// reactstrap components
import {
	Badge,
	Card,
	CardHeader,
	CardFooter,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	Pagination,
	PaginationItem,
	PaginationLink,
	Progress,
	Table,
	Container,
	Row,
	UncontrolledTooltip,
	Spinner,
	Button,
	Form,
	FormGroup,
	Input,
	Col
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';

class Izin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			izin: [],
			loading: false,
			approvalMode: false,
			rejectMode: false,
			counter: 0,
			loadingModal: false,
			fullnames: '',
			userId: '',
			userIndex: 0,
			reason: '',
			checkId: [],
			approveAllMode: false,
			rejectAllMode: false,
			deleteCounter: 0
		};
	}

	componentDidMount() {
		this.getTotalIzin();
	}

	getTotalIzin = () => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.include('user');
		query.equalTo('statusIzin', 1);
		query.equalTo('status', 3);
		query.equalTo('leaderId', getLeaderId);
		query
			.find()
			.then((x) => {
				x.map((y) => (y.select = false));
				this.setState({ izin: x, loading: false });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	closeLoading = () => {
		this.setState({ loadingModal: false });
	};

	handleApproval = (e, approvalMode) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query
			.get(this.state.userId)
			.then((x) => {
				x.set('status', approvalMode ? 1 : 0);
				if (!approvalMode) x.set('alasanReject', this.state.reason);
				x
					.save()
					.then(() => {
						let newArr = [ ...this.state.izin ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							counter: this.state.counter + 1,
							izin: newArr,
							[approvalMode ? 'approvalMode' : 'rejectMode']: false,
							loadingModal: false
						});
						alert(`Berhasil ${approvalMode ? 'approve' : 'reject'}`);
						return;
					})
					.catch((err) => {
						alert(err.message);
						this.closeLoading();
						return;
					});
			})
			.catch((err) => {
				alert(err.message);
				this.closeLoading();
				return;
			});
	};

	toggle = (state) => {
		this.setState({
			[state]: !this.state[state]
		});
	};

	handleAllCheck = (e) => {
		let izin = this.state.izin;
		let collecId = [];

		izin.map((x) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ izin: izin, checkId: collecId }, () => console.log(this.state.checkId));
	};

	handleChildCheck = (e) => {
		let { izin } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		izin.map((x) => {
			console.log('bandingkan', x.id === e.target.value);
			if (x.id === e.target.value) {
				console.log('sama');
				x.select = e.target.checked;
				if (x.select) {
					this.setState(
						(prevState) => ({
							checkId: [ ...this.state.checkId, checked ]
						}),
						() => console.log(this.state.checkId)
					);
				} else {
					const index = checkId.indexOf(checked);
					if (index > -1) {
						checkId.splice(index, 1);
						this.setState(
							(prevState) => ({
								checkId: checkId
							}),
							() => console.log(this.state.checkId)
						);
					}
				}
			}
		});

		this.setState({ izin: izin });
	};

	handleApproveAll = (e) => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newArr = [ ...this.state.izin ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					izin: newArr,
					counter: this.state.counter + 1,
					approvalMode: false,
					loading: false
				});
			});
		});
	};

	handleRejectAll = (e) => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.set('alasanReject', this.state.reason);
			x.save().then(() => {
				const newArr = [ ...this.state.izin ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					counter: this.state.counter + 1,
					izin: newArr
				});
			});
		});
	};

	approveChecked = (e) => {
		this.setState({ loadingModal: true });
		const { checkId } = this.state;
		let totalData = 0;

		checkId.map((id) => {
			const Izin = Parse.Object.extend('Izin');
			const query = new Parse.Query(Izin);

			query.get(id).then((x) => {
				x.set('status', 1);
				x.save().then(() => {
					totalData = totalData + 1;
					if (totalData === checkId.length) {
						alert('Berhasil reject');
						return window.location.reload(false);
					}
				});
			});
		});

		this.setState({ loadingModal: false });
	};

	rejectChecked = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const { checkId } = this.state;
		let totalData = 0;

		checkId.map((id) => {
			const Izin = Parse.Object.extend('Izin');
			const query = new Parse.Query(Izin);

			query.get(id).then((x) => {
				x.set('status', 1);
				x.set('alasanReject', this.state.reason);
				x.save().then(() => {
					totalData = totalData + 1;
					if (totalData === checkId.length) {
						alert('Berhasil reject');
						return window.location.reload(false);
					}
					// const newArr = [ ...this.state.izin ];
					// newArr.splice(this.state.userIndex, 1);
					// this.setState({
					// 	izin: newArr,
					// 	approvalMode: false,
					// 	loading: false
					// });
				});
			});
		});
	};

	render() {
		const {
			izin,
			loading,
			approvalMode,
			rejectMode,
			loadingModal,
			fullnames,
			counter,
			approveAllMode,
			rejectAllMode
		} = this.state;

		return (
			<React.Fragment>
				<Header izin={counter} />
				{/* Page content */}
				<Container className="mt--7" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-2">Request izin</h3>
									{izin.length === 0 ? (
										''
									) : this.state.checkId.length === 0 ? (
										''
									) : (
										<Col sm={{ span: 0 }} className="float-none">
											<Button
												color="primary"
												size="sm"
												type="submit"
												disable={loading ? 'true' : 'false'}
												className="mr-2 m-1"
												onClick={() =>
													this.setState({ approveAllMode: true })}
											>
												<i className="fa fa-check" />{' '}
												{loading ? 'Fetching...' : 'Approve'}
											</Button>
											<Button
												color="primary"
												type="submit"
												size="sm"
												className="m-1"
												disable={loading ? 'true' : 'false'}
												onClick={() =>
													this.setState({ rejectAllMode: true })}
											>
												<i className="fa fa-times" />{' '}
												{loading ? 'Fetching...' : 'Reject'}
											</Button>
										</Col>
									)}
									{/* <input type="text" placeholder="input" /> */}
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th>
												<input
													type="checkbox"
													onChange={this.handleAllCheck}
												/>
											</th>
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Alasan</th>
											<th scope="col">Keterangan</th>
											<th scope="col">Aksi</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={6} style={{ textAlign: 'center' }}>
												<Spinner
													as="span"
													cuti
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
										) : izin.length < 1 ? (
											<td colSpan={6} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											izin.map((prop, key) => (
												<tr>
													<td>
														<input
															type="checkbox"
															value={prop.id}
															checked={prop.select}
															onChange={this.handleChildCheck}
														/>
													</td>
													<td>{prop.get('user').attributes.nik}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('alasanIzin')}</td>
													<td>{prop.get('descIzin')}</td>
													<td>
														<Button
															id="t1"
															color="primary"
															className="btn-circle"
															onClick={() => {
																this.setState({
																	approvalMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-check" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t1"
														>
															Approve
														</UncontrolledTooltip>
														<Button
															id="t2"
															className="btn-circle btn-danger"
															onClick={(e) => {
																this.setState({
																	rejectMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-times" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t2"
														>
															Reject
														</UncontrolledTooltip>
													</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
						</div>
					</Row>
				</Container>

				<ModalHandler
					show={approvalMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approvalMode')}
					title="Approval Confirmation"
					body={`Approve izin ${fullnames} ?`}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject izin ${fullnames} ?`}</h3>
							<Form onSubmit={(e) => this.handleApproval(e, false)}>
								<FormGroup>
									<Input
										id="exampleFormControlInput1"
										placeholder="Masukkan alasan"
										type="textarea"
										required={true}
										onChange={(e) => this.setState({ reason: e.target.value })}
									/>
								</FormGroup>
								<Button
									color="secondary"
									data-dismiss="modal"
									type="button"
									onClick={() => this.toggle('rejectMode')}
								>
									Close
								</Button>
								<Button color="primary" type="submit">
									{loadingModal ? (
										<div>
											<Spinner
												as="span"
												animation="grow"
												size="sm"
												role="status"
												aria-hidden="true"
											/>{' '}
											Submitting...
										</div>
									) : (
										'Submit'
									)}
								</Button>
							</Form>
						</div>
					}
					handleSubmit={(e) => this.handleApproval(e, false)}
				/>

				{/* Approve All Modal */}
				<ModalHandler
					show={approveAllMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approveAllMode')}
					title="Approve Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Approve izin ${this.state.checkId
								.length} data ?`}</h3>
						</div>
					}
					handleSubmit={this.approveChecked}
				/>

				{/* Reject All Modal */}
				<ModalHandler
					show={rejectAllMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('rejectAllMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject izin ${this.state.checkId
								.length} data ?`}</h3>
							<Form onSubmit={(e) => this.rejectChecked(e)}>
								<FormGroup>
									<Input
										id="exampleFormControlInput1"
										placeholder="Masukkan alasan"
										type="textarea"
										required={true}
										onChange={(e) => this.setState({ reason: e.target.value })}
									/>
								</FormGroup>
								<Button
									color="secondary"
									data-dismiss="modal"
									type="button"
									onClick={() => this.toggle('rejectAllMode')}
								>
									Close
								</Button>
								<Button color="primary" type="submit">
									{loadingModal ? (
										<div>
											<Spinner
												as="span"
												animation="grow"
												size="sm"
												role="status"
												aria-hidden="true"
											/>{' '}
											Submitting...
										</div>
									) : (
										'Submit'
									)}
								</Button>
							</Form>
						</div>
					}
					handleSubmit={this.rejectChecked}
				/>
			</React.Fragment>
		);
	}
}

export default Izin;
