import React from 'react';
import ReactDOM from 'react-dom';
import {Link,Route,Router,browserHistory} from 'react-router';
import Dashboard from './dashboard.js';
import Login from './login.js';

class App extends React.Component {
	render() {
		return (
			<div>
				<header>
					<h1>Test</h1>
					<nav>
						<ul>
							<li>
								<Link to="/oauth/login">Login</Link>
							</li>
						</ul>
					</nav>
				</header>
				{this.props.children || <h2>Please login.</h2>}
			</div>
		)
	}
}


ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/oauth" component={App}>
			<Route path="dashboard" component={Dashboard} />
			<Route path="login" component={Login} />
		</Route>
	</Router>
, document.getElementById('app'));


