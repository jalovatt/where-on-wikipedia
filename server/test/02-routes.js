const Mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");

const assert = chai.assert;

chai.use(chaiHttp);

xdescribe("Routes", () => {

  let app;
  before(async () => {
    app = await require("../app.js");
  });

  it("blah blah", () => {
    assert.isTrue(true);
  });

});
