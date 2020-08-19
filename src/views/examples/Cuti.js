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
	Table,
	Container,
	Row,
	UncontrolledTooltip,
	Spinner,
	Button,
	Input,
	FormGroup,
	Label,
	Form,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Col
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import { convertDate } from 'utils';

class Cuti extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cuti: [],
			loading: false,
			rejectMode: false,
			approvalMode: false,
			fullnames: '',
			loadingModal: false,
			userIndex: 0,
			minus: false,
			counter: 0,
			userId: '',
			reason: '',
			checkId: []
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.include('user');
		query.equalTo('statusIzin', 2);
		query.equalTo('status', 3);
		query.equalTo('leaderId', getLeaderId);
		query
			.find()
			.then((x) => {
				x.map((y) => (y.select = false));
				this.setState({ cuti: x, loading: false });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
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
						let newArr = [ ...this.state.cuti ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							counter: this.state.counter + 1,
							cuti: newArr,
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
		let cuti = this.state.cuti;
		let collecId = [];

		cuti.map((x) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ cuti: cuti, checkId: collecId }, () => console.log(this.state.checkId));
	};

	handleChildCheck = (e) => {
		let { cuti } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		cuti.map((x) => {
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

		this.setState({ cuti: cuti });
	};

	handleApproveAll = (e) => {
		this.setState({ loading: true });
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newArr = [ ...this.state.cuti ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					cuti: newArr,
					approvalMode: false,
					loading: false
				});
			});
		});
	};

	handleRejectAll = (e) => {
		this.setState({ loading: true });
		const Cuti = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Cuti);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newArr = [ ...this.state.cuti ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					cuti: newArr,
					rejectMode: false,
					loading: false
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
			cuti,
			minus,
			loading,
			loadingModal,
			approvalMode,
			rejectMode,
			fullnames,
			counter
		} = this.state;

		return (
			<React.Fragment>
				<Header cuti={counter} />
				{/* Page content */}
				<Container className="mt--7" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-2">Request cuti</h3>
									{cuti.length === 0 ? (
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
												onClick={this.approveChecked}
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
												onClick={this.rejectChecked}
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
											<th scope="col">Dari</th>
											<th scope="col">Sampai</th>
											<th scope="col">Approve</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<tr>
												<td colSpan={9} style={{ textAlign: 'center' }}>
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
											</tr>
										) : cuti.length < 1 ? (
											<tr>
												<td colSpan={9} style={{ textAlign: 'center' }}>
													No data found...
												</td>
											</tr>
										) : (
											cuti.map((prop, key) => (
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
														{convertDate(
															prop.get('dari'),
															'DD/MM/YYYY'
														)}
													</td>
													<td>
														{convertDate(
															prop.get('sampai'),
															'DD/MM/YYYY'
														)}
													</td>
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
															color="danger"
															className="btn-circle"
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

				{/* approve modal */}
				<ModalHandler
					show={approvalMode}
					loading={loadingModal}
					footer={true}
					handleHide={() => this.toggle('approvalMode')}
					title="Approval Confirmation"
					body={`Approve cuti ${fullnames} ?`}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					footer={false}
					body={
						<div>
							<h3 className="mb-4">{`Reject cuti ${fullnames} ?`}</h3>
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
			</React.Fragment>
		);
	}
}

export default Cuti;
