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
import { handleConvert } from 'utils';
import { convertDate } from 'utils';

class ViewHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			loading: false,
			approvalMode: false,
			rejectMode: false,
			userIndex: 0,
			loadingModal: false,
			userId: '',
			fullnames: '',
			reason: '',
			checkId: [],
			rejectAllMode: false,
			approveAllMode: false,
			searchValue: '',
			searchBy: 'Cuti'
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = () => {
		this.setState({ loading: true });
		const { searchBy, searchValue } = this.state;
		const userId = this.props.match.params.id;

		const Search = Parse.Object.extend(handleConvert(searchBy));
		const query = new Parse.Query(Search);

		let status;

		if (searchBy === 'Absen') {
			query.equalTo('leaderId', getLeaderId);
			query.ascending('absenMasuk');
			query.include('user');
			query
				.get(userId)
				.then((x) => {
					console.log('user', x);
					this.setState({ history: x, loading: false });
					return;
				})
				.catch((err) => {
					alert(err.message);
					console.log(err);
					this.setState({ loading: false });
					return;
				});
		}

		if (searchBy === 'Cuti') {
			query.descending('createdAt');
			query.equalTo('user', { __type: 'Pointer', className: '_User', objectId: userId });
			query.include('user');
			// query.equalTo('statusIzin', 2);
			// // query.equalTo('status', 3);
			// query.equalTo('leaderId', getLeaderId);
			query
				.find()
				.then((x) => {
					console.log('wew', x);
					x.map((y) => (y.select = false));
					this.setState({ history: x, loading: false });
					return;
				})
				.catch(({ message }) => {
					this.setState({ loading: false });
					alert(message);
					return;
				});
		}

		if (searchBy === 'Izin') {
			query.include('user');
			query.equalTo('statusIzin', 1);
			query.equalTo('status', 3);
			query.equalTo('leaderId', getLeaderId);
			query
				.get(userId)
				.then((x) => {
					x.map((y) => (y.select = false));
					this.setState({ history: x, loading: false });
					return;
				})
				.catch(({ message }) => {
					this.setState({ loading: false });
					console.log('err', message);
					alert(message);
					return;
				});
		}

		// const Search = Parse.Object.extend(handleConvert(searchBy));
		// const query = new Parse.Query(Search);

		// query.equalTo('leaderId', getLeaderId);
		// query.equalTo('status', 3);
		// query.equalTo('user', userId);
		// query
		// 	.find()
		// 	.then((x) => {
		// 		x.map((y) => (y.select = false));
		// 		console.log('zz', x);
		// 		this.setState({ history: x, loading: false });
		// 	})
		// 	.catch((err) => {
		// 		alert(err.message);
		// 		this.setState({ loading: false });
		// 	});
	};

	closeLoading = () => {
		this.setState({ loadingModal: false });
	};

	handleApproval = (e, approvalMode) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const Overtime = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Overtime);

		query
			.get(this.state.userId)
			.then((x) => {
				x.set('status', approvalMode ? 1 : 0);
				if (!approvalMode) x.set('alasanReject', this.state.reason);
				x
					.save()
					.then(() => {
						let newArr = [ ...this.state.overtime ];
						newArr.splice(this.state.userIndex, 1);
						this.setState({
							counter: this.state.counter + 1,
							overtime: newArr,
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
		let overtime = this.state.overtime;
		let collecId = [];

		overtime.map((x) => {
			x.select = e.target.checked;
			if (x.select) {
				collecId.push(x.id);
			} else {
				collecId = [];
			}

			return x;
		});

		this.setState({ overtime: overtime, checkId: collecId }, () =>
			console.log(this.state.checkId)
		);
	};

	handleChildCheck = (e) => {
		let { overtime } = this.state;
		const { checkId } = this.state;
		let checked = e.target.value;
		overtime.map((x) => {
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

		this.setState({ overtime: overtime });
	};

	handleApproveAll = (e) => {
		this.setState({ loading: true });
		const Overtime = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Overtime);

		query.get(e).then((x) => {
			x.set('status', 1);
			x.save().then(() => {
				const newArr = [ ...this.state.overtime ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					overtime: newArr,
					approvalMode: false,
					loading: false
				});
			});
		});
	};

	handleRejectAll = (e) => {
		this.setState({ loading: true });
		const Overtime = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Overtime);

		query.get(e).then((x) => {
			x.set('status', 0);
			x.save().then(() => {
				const newArr = [ ...this.state.overtime ];
				newArr.splice(this.state.userIndex, 1);
				this.setState({
					overtime: newArr,
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
			const Overtime = Parse.Object.extend('Overtime');
			const query = new Parse.Query(Overtime);

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
			const Overtime = Parse.Object.extend('Overtime');
			const query = new Parse.Query(Overtime);

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
			history,
			loading,
			approvalMode,
			rejectMode,
			loadingModal,
			fullnames,
			approveAllMode,
			rejectAllMode
		} = this.state;

		return (
			<React.Fragment>
				<Header />
				{/* Page content */}
				<Container className="mt--7" fluid>
					{/* Table */}
					<Row>
						<div className="col">
							<Card className="shadow">
								<CardHeader className="border-0">
									<h3 className="mb-0">History {this.state.searchBy}</h3>
									{history.length === 0 ? (
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
												onClick={this.setState({ rejectAllMode: true })}
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
											<th scope="col">NIK</th>
											<th scope="col">Nama</th>
											<th scope="col">Tanggal</th>
											<th scope="col">Status</th>
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
										) : history.length < 1 ? (
											<td colSpan={5} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											history.map((prop, key) => (
												<tr>
													<td>{prop.get('user').attributes.nik}</td>
													<td>{prop.get('fullname')}</td>
													<td>
														{convertDate(
															prop.get('createdAt'),
															'DD/MM/YYYY'
														)}
													</td>
													<td
														style={{
															color: `${prop.get('status') === 0
																? 'red'
																: 'blue'}`
														}}
													>
														{prop.get('status') === 3 ? (
															'Menunggu konfirmasi'
														) : prop.get('status') === 0 ? (
															'Rejected'
														) : (
															'Approved'
														)}
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
					body={`Approve lembur ${fullnames} ?`}
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
							<h3 className="mb-4">{`Reject lembur ${fullnames} ?`}</h3>
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
					footer={false}
					handleHide={() => this.toggle('approveAllMode')}
					title="Approve Confirmation"
					body={
						<div>
							<h3 className="mb-4">{`Approve lembur ${this.state.checkId
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
							<h3 className="mb-4">{`Reject lembur ${this.state.checkId
								.length} data ?`}</h3>
							<Form onSubmit={this.rejectChecked}>
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
					handleSubmit={this.rejectChecked}
				/>
			</React.Fragment>
		);
	}
}

export default ViewHistory;
