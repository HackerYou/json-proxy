const expect = require('expect.js');
const request = require('superagent');

describe('Get requests', () => {
	it('should make a request', (done) => {
		request
			.get('http://localhost:4500')
			.send({
				reqUrl: 'http://api.icndb.com/jokes/random',
				params: {
					firstName: "John",
					lastName: "Doe"
				}
			})
			.end((err,res) => {
				expect(err).to.be(null);
				expect(res).to.be.an('object');
				done()
			});
	});

	it('should convert XML to JSON', (done) => {
		request
			.get('http://localhost:4500')
			.send({
				reqUrl: "https://www.goodreads.com/search/index.xml",
				params: {
					key: 'AYoaCzPGXisCTWsP6Ainw',
					q: 'William Gibson'
				},
				xmlToJson: true
			})
			.end((err,res) => {
				expect(err).to.be(null);
				expect(res).to.be.an('object');
				done();
			});
	});

	it('should use the cache', (done) => {
		request
			.get('http://localhost:4500')
			.send({
				reqUrl: "https://www.goodreads.com/search/index.xml",
				params: {
					key: 'AYoaCzPGXisCTWsP6Ainw',
					q: 'William Gibson'
				},
				xmlToJson: true,
				useCache: true
			})
			.end((err,res) => {
				expect(err).to.be(null);
				expect(res).to.be.an('object');
				done();
			});
	});
});

