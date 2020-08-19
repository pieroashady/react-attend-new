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
	Spinner
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import Parse from 'parse';
import moment from 'moment';
import { getLeaderId } from 'utils';

class Tables extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			absence: [],
			loading: false
		};
	}

	componentDidMount() {
		this.getDaftarAbsen();
	}

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

		query.equalTo('leaderId', getLeaderId);
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
		const { absence, loading } = this.state;
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
									<h3 className="mb-0">Absen hari ini</h3>
									{/* <input type="text" placeholder="input" /> */}
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
													<td>{prop.get('user').nik}</td>
													<td>{prop.get('fullname')}</td>
													<td>{prop.get('absenMasuk')}</td>
													<td>{prop.get('absenKeluar')}</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card>
						</div>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default Tables;
