import React from 'react';

export default class Dashboard extends React.Component {
	render() {
		return (
			<div>
				<h2>oAuth2 Settings</h2>
				<form action="">
					<div>
						<label htmlFor="application">Application Name</label>
						<input type="text" id="application"/>
					</div>
					<div>
						<label htmlFor="request">Request Token Url</label>
						<input type="text" id="request"/>
					</div>
					<div>
						<label htmlFor="access">Access Token Url</label>
						<input type="text" id="access"/>
					</div>
					<div>
						<label htmlFor="client">Client ID</label>
						<input type="text" id="client"/>
					</div>
					<div>
						<label htmlFor="secret">Consumer Secret</label>
						<input type="text" id="secret"/>
					</div>
				</form>
			</div>
		)
	}
}