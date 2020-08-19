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
	Form,
	FormGroup,
	Input,
	Col,
	Label,
	FormText
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';
import ModalHandler from 'components/Modal/Modal';
import Axios from 'axios';

class ChangeRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			staff: [],
			loading: false,
			requestMode: false,
			userIndex: 0,
			loadingModal: false,
			userId: '',
			fullnames: '',
			reason: '',
			checkId: [],
			loadingReco: false,
			message: '',
			statusReco: 0,
			fotoWajah: '',
			jumlahCuti: '',
			lokasiKerja: '',
			jamKerja: '',
			lembur: ''
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.setState({ loading: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		query.equalTo('leaderId', getLeaderId);
		query.notContainedIn('roles', [ 'admin', 'leader' ]);

		query
			.find({ useMasterKey: true })
			.then((x) => {
				console.log(x);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loadingModal: true });
		const { userId, fotoWajah, imei, lokasiKerja, jamKerja, jumlahCuti, lembur } = this.state;

		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const cr = new ChangeRequest();

		cr.set('idUser', Parse.User.createWithoutData(userId));
		if (fotoWajah !== '') cr.set('fotoWajah', new Parse.File('foto_wajah.jpg', fotoWajah));
		if (imei !== '') cr.set('imei', imei);
		if (jamKerja !== '') cr.set('jamKerja', jamKerja);
		if (lokasiKerja !== '') cr.set('lokasiKerja', lokasiKerja);
		if (jumlahCuti !== '') cr.set('jumlahCuti', parseInt(jumlahCuti));
		if (lembur !== '') cr.set('lembur', lembur);

		cr
			.save()
			.then((x) => {
				alert('Succes melakukan request!');
				this.setState({ requestMode: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ requestMode: false });
			});
	};

	handleFace = (e) => {
		this.setState({
			loadingReco: true,
			statusReco: 0,
			fotoWajah: e.target.files[0]
		});

		const formData = new FormData();
		formData.append('knax', e.target.files[0]);

		Axios.post('http://35.247.147.177:4000/api/face-check', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(({ data }) => {
				if (data.status === 1)
					return this.setState({
						statusReco: 1,
						message: `✔️ ${data.message}`,
						loadingReco: false
					});
				return this.setState({
					statusReco: 0,
					message: `✖️ ${data.message}`,
					loadingReco: false
				});
			})
			.catch((err) => alert('Terjadi error...'));
	};

	render() {
		const {
			staff,
			loading,
			loadingModal,
			loadingReco,
			requestMode,
			message,
			statusReco
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
									<h3 className="mb-0">Data staff</h3>
									{staff.length === 0 ? (
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
											<th scope="col">Jam Kerja</th>
											<th scope="col">Sisa Cuti</th>
											<th scope="col">Lembur</th>
											<th scope="col">Lokasi Kerja</th>
											<th scope="col">Aksi</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<td colSpan={7} style={{ textAlign: 'center' }}>
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
										) : staff.length < 1 ? (
											<td colSpan={7} style={{ textAlign: 'center' }}>
												No data found...
											</td>
										) : (
											staff.map((prop, key) => (
												<tr>
													<td>{prop.get('nik')}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('jamKerja')}</td>
													<td>{prop.get('jumlahCuti')}</td>
													<td>{prop.get('lembur')}</td>
													<td>{prop.get('lokasiKerja')}</td>
													<td>
														<Button
															id="t1"
															color="primary"
															className="btn-circle"
															onClick={() => {
																this.setState({
																	requestMode: true,
																	userId: prop.id,
																	userIndex: key,
																	fullnames: prop.get('fullname')
																});
															}}
														>
															<i className="fa fa-edit" />
														</Button>
														<UncontrolledTooltip
															delay={0}
															placement="top"
															target="t1"
														>
															Ubah data
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

				{/* Ubah Data Modal */}
				<ModalHandler
					show={requestMode}
					loading={loadingModal}
					footer={false}
					handleHide={() => this.toggle('requestMode')}
					title="Change Request Form"
					body={
						<div>
							<Form onSubmit={this.handleSubmit} className="text-dark">
								<FormGroup>
									<Label>Foto Wajah</Label>
									<Input
										id="exampleFormControlInput1"
										type="file"
										onChange={this.handleFace}
									/>
									<FormText
										className={loadingReco ? 'text-muted' : ''}
										style={{ color: `${statusReco == 0 ? 'red' : 'green'}` }}
									>
										{loadingReco ? 'Processing...' : message}
									</FormText>
								</FormGroup>
								<FormGroup controlId="formImei">
									<Label>IMEI</Label>
									<Input
										autoCapitalize="true"
										autoComplete="false"
										type="text"
										placeholder="Masukkan imei hp"
										onChange={(e) =>
											this.setState({
												imei: e.target.value
											})}
									/>
								</FormGroup>

								<FormGroup controlId="formImei">
									<Label>Jam Kerja</Label>
									<Input
										autoCapitalize="true"
										autoComplete="false"
										type="select"
										onChange={(e) =>
											this.setState({
												jamKerja: e.target.value
											})}
									>
										{[ 'Jam tetap', 'Jam fleksibel', 'Jam bebas' ].map((x) => (
											<option value={x}>{x}</option>
										))}
									</Input>
								</FormGroup>

								<FormGroup controlId="formLokasi">
									<Label>Lokasi kerja</Label>
									<Input
										type="select"
										defaultValue="all"
										required={true}
										onChange={(e) =>
											this.setState({
												lokasiKerja: e.target.value
											})}
									>
										{[ 'Tetap', 'Bebas (mobile)' ].map((x) => (
											<option value={x}>{x}</option>
										))}
									</Input>
								</FormGroup>

								<FormGroup controlId="formCuti">
									<Label>Jumlah cuti</Label>
									<Input
										type="number"
										placeholder="Masukkan jumlah cuti"
										onChange={(e) =>
											this.setState({
												jumlahCuti: parseInt(e.target.value)
											})}
									/>
								</FormGroup>

								<FormGroup controlId="formLembut">
									<Label>Lembur</Label>
									<Input
										className="text-dark"
										type="select"
										defaultValue="all"
										onChange={(e) =>
											this.setState({
												lembur: e.target.value
											})}
									>
										{[ 'Ya', 'Tidak' ].map((x) => (
											<option value={x}>{x}</option>
										))}
									</Input>
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

export default ChangeRequest;
