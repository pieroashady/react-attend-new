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

class Terlambat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			late: [],
			loading: false,
			approvalMode: false,
			rejectMode: false,
			counter: 0,
			loadingModal: false,
			fullnames: '',
			userIndex: 0,
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
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

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
			.find()
			.then((x) => {
				x.map((y) => (y.select = false));
				console.log(x);
				this.setState({ late: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	};

	handleApproval = (e, approvalMode) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query
			.get(this.state.userId)
			.then((x) => {
				x.set('status', approvalMode ? 1 : 0);
				if (!approvalMode) x.set('alasanReject', this.state.reason);
				x
					.save()
					.then(() => {
						let newArr = [ ...this.state.leave ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							counter: this.state.counter + 1,
							late: newArr,
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
		let late = this.state.late;
		let collecId = [];

		late.map((x) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ late: late, checkId: collecId }, () => console.log(this.state.checkId));
	};

	handleChildCheck = (e) => {
		let { late } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		late.map((x) => {
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

		this.setState({ late: late });
	};

	handleApproveAll = (e) => {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newArr = [ ...this.state.late ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					late: newArr,
					approvalMode: false,
					loading: false
				});
			});
		});
	};

	handleRejectAll = (e) => {
		this.setState({ loading: true });
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newArr = [ ...this.state.late ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					late: newArr,
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
			const Late = Parse.Object.extend('Late');
			const query = new Parse.Query(Late);

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
			const Late = Parse.Object.extend('Late');
			const query = new Parse.Query(Late);

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
			late,
			loading,
			fullnames,
			loadingModal,
			counter,
			approvalMode,
			rejectMode
		} = this.state;

		return (
			<React.Fragment>
				<Header lateCounter={counter} />
				{/* Page content */}
				<Container className="mt--7" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-0">Request datang terlambat</h3>
									{late.length === 0 ? (
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
											<th scope="col">Approve</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
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
										) : late.length < 1 ? (
											<td colSpan={4} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											late.map((prop, key) => (
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
													<td>{prop.get('alasan')}</td>
													<td>
														<Button
															id="t1"
															className="btn-circle btn-warning mr-2"
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
															<i className="fa fa-close" />
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
					handleHide={() => this.toggle('approvalMode')}
					title="Approval Confirmation"
					body={`Approve terlambat ${fullnames} ?`}
					handleSubmit={(e) => this.handleApproval(e, true)}
				/>

				{/* reject modal */}
				<ModalHandler
					show={rejectMode}
					loading={loadingModal}
					handleHide={() => this.toggle('rejectMode')}
					title="Reject Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Reject terlambat ${fullnames} ?`}</h3>
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

export default Terlambat;
