const expect = require('expect.js');
const request = require('superagent');

describe('Post requests', () => {
	it('Should make a post request', (done) => {
		request
			.post('http://localhost:4500')
			.send({
				reqUrl: 'http://api.hackeryou.com/v1/key',
				params: {
					email: 'ryan@hackeryou.com'
				}
			})
			.end((err,res) => {
				expect(err).to.be(null);
				done(); 
			})
	});
});