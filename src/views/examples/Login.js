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
	UncontrolledAlert,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Spinner,
	Col
} from 'reactstrap';

import Parse from 'parse';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: '',
			password: '',
			error: ''
		};
	}

	componentDidMount() {
		console.log('Mounted');
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		const { username, password } = this.state;
		Parse.User
			.logIn(username, password)
			.then((x) => {
				this.setState({ loading: false });
				this.props.history.push('/admin/index');
			})
			.catch((err) => {
				console.log(err);
				this.setState({ error: err.message, loading: false });
			});
	};

	render() {
		const { loading, error } = this.state;

		return (
			<React.Fragment>
				<Col lg="5" md="7">
					<Card className="bg-secondary shadow border-0">
						{/* <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader> */}
						<CardBody className="px-lg-5 py-lg-5">
							<div className="text-center text-muted mb-4">
								{error !== '' ? (
									<UncontrolledAlert color="danger" fade={false}>
										<span className="alert-inner--text">{error}</span>
									</UncontrolledAlert>
								) : (
									<small>Masukkan username dan password</small>
								)}
							</div>
							<Form role="form" onSubmit={this.handleSubmit}>
								<FormGroup className="mb-3">
									<InputGroup className="input-group-alternative">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-circle-08" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Username"
											type="text"
											autoComplete="new-email"
											required={true}
											onChange={(e) =>
												this.setState({ username: e.target.value })}
										/>
									</InputGroup>
								</FormGroup>
								<FormGroup>
									<InputGroup className="input-group-alternative">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-lock-circle-open" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Password"
											type="password"
											autoComplete="new-password"
											required={true}
											onChange={(e) =>
												this.setState({ password: e.target.value })}
										/>
									</InputGroup>
								</FormGroup>
								{/* <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div> */}
								<div className="text-center">
									<Button
										className="my-4"
										color="primary"
										type="submit"
										disabled={loading}
									>
										{loading ? (
											<div>
												<Spinner
													as="span"
													animation="grow"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{' '}
												Signing in...
											</div>
										) : (
											'Sign in'
										)}
									</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
					{/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
				</Col>
			</React.Fragment>
		);
	}
}

export default Login;
