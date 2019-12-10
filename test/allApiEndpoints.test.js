/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

/* eslint-disable no-unused-expressions */
// set ENV to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

const server = 'http://frontend-api:9191';
let testcases = null;

describe('Check all APIs', () => {
  it('should list 5 test cases on /testcase GET', (done) => {
    chai
      .request(server)
      .get('/api/v1/testcase')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        expect(res.body.testcases.items).to.be.a('array');
        expect(res.body.testcases.items.length).to.be.equal(5);
        testcases = res.body.testcases.items;
        done();
      });
  });

  it('should return all test results of the test case on /testcase/{testcaseId} GET', (done) => {
    chai
      .request(server)
      .get(`/api/v1/testcase/${testcases[0].testNumber}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        expect(res.body.testResults).to.be.a('array');
        expect(res.body.testResults.length).to.be.above(0);
        done();
      });
  });

  it('should return a succeed response on /testcase/path/{path} GET', (done) => {
    chai
      .request(server)
      .get(`/api/v1/testcase/path/${testcases[0].path}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        done();
      });
  });

  it('should return a succeed response on /testcase/search POST', (done) => {
    const keyword = { name: 'Cookie' };
    chai
      .request(server)
      .post('/api/v1/testcase/search')
      .send(keyword)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        expect(res.body.searchresult).to.be.a('array');
        done();
      });
  });

  it('should return all tags on /tag GET', (done) => {
    chai
      .request(server)
      .get('/api/v1/tag')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        expect(res.body.tags).to.be.a('array');
        expect(res.body.tags.length).to.be.above(0);
        done();
      });
  });

  it('should return a succeed response on /tag/{tagName} GET', (done) => {
    chai
      .request(server)
      .get('/api/v1/tag/example')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        done();
      });
  });
});
