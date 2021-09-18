const expect = require('expect.js');
const request = require('superagent');

describe('Post requests', () => {
	it('Should make a post request', (done) => {
		request
			.post('http://localhost:4500')
			.send({
				reqUrl: 'https://reqbin.com/echo/post/json',
				params: {
				  "Id": 12345,
				  "Customer": "Jane Smith",
				  "Quantity": 1,
				  "Price": 99.99
				}
			})
			.end((err,res) => {
				expect(err).to.be(null);
				done();
			})
	});
});
