/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

// set ENV to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

const server = 'http://frontend-api:9191';

describe('Test cases framework', () => {
  it('should list ALL test cases on /testcase GET', (done) => {
    chai
      .request(server)
      .get('/api/v1/testcase')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.be.json;
        expect(res.text.length).to.be.above(0);
        done();
      });
  });
});
