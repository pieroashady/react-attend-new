import React, { Component } from 'react';
import { Modal, Button, Spinner } from 'reactstrap';

class ModalHandler extends Component {
	render() {
		return (
			<Modal
				scrollable={true}
				className="modal-dialog-centered"
				isOpen={this.props.show}
				toggle={this.props.handleHide}
			>
				<div className="modal-header">
					<h3 className="modal-title" id="exampleModalLabel">
						{this.props.title}
					</h3>
					<button
						aria-label="Close"
						className="close"
						data-dismiss="modal"
						type="button"
						onClick={this.props.handleHide}
					>
						<span aria-hidden={true}>×</span>
					</button>
				</div>
				<div className="modal-body text-danger">{this.props.body}</div>
				{this.props.footer ? (
					<div className="modal-footer">
						<Button
							color="secondary"
							data-dismiss="modal"
							type="button"
							onClick={this.props.handleHide}
						>
							Close
						</Button>
						<Button color="primary" type="button" onClick={this.props.handleSubmit}>
							{this.props.loading ? (
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
					</div>
				) : (
					''
				)}
			</Modal>
		);
	}
}

export default ModalHandler;
