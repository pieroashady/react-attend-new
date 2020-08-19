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
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col
} from 'reactstrap';
// core components
import UserHeader from 'components/Headers/UserHeader.js';
import Parse from 'parse';
import moment from 'moment';
import _ from 'lodash/lang';
import { getLeaderId } from 'utils';
import { slicename } from 'utils/slice';
import { Link } from 'react-router-dom';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			daftarStaff: [],
			loading: false
		};
	}

	componentDidMount() {
		this.getAbsenStaff();
	}

	getAbsenStaff() {
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
	}

	render() {
		const { daftarStaff } = this.state;
		return (
			<React.Fragment>
				<UserHeader />
				{/* Page content */}
				<Container className="mt-2" fluid>
					<Row>
						{daftarStaff.map((staff) => (
							<Col md={3} className="mt-4">
								<Card className="card-profile shadow">
									<Row className="justify-content-center">
										<Col className="order-lg-2" lg="3">
											<div className="card-profile-image">
												<a href={staff.get('fotoWajah').url()}>
													<img
														alt="..."
														style={{ height: '150px', width: '150px' }}
														className="rounded-circle"
														src={staff.get('fotoWajah').url()}
													/>
												</a>
											</div>
										</Col>
									</Row>
									<CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4" />
									<CardBody className="pt-0 pt-md-4">
										<div className="text-center mt-md-5">
											<h3>{slicename(staff.get('fullname'))}</h3>
											<div className="h5 font-weight-300">
												<i className="ni location_pin mr-2" />
												{staff.get('nik')}
											</div>
											<div className="h5">
												<i className="ni business_briefcase-24 mr-2" />
												{!_.isEmpty(staff.get('email')) ? (
													staff.get('email')
												) : (
													'-'
												)}
											</div>
											<Link to={`/admin/view-history/${staff.id}`}>
												<Button
													outline
													color="primary"
													size="sm"
													className=""
												>
													<i className="ni ni-spaceship" /> View History
												</Button>
											</Link>
										</div>
									</CardBody>
								</Card>
							</Col>
						))}
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default Profile;
