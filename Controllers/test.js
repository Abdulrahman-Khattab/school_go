// test/controllerAccount.test.js
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const { createControllerAccount } = require('./users'); // Adjust the path
const CONTROLLER_SCHEMA = require('../model/user_controller');

const generateRandomString = require('../utility/randomGenerator');
const { badRequestError } = require('../errors_2');
const { attachCookieToResponse } = require('../utility/jwt');
const createUserToken = require('../utility/createTokenUser');

describe('createControllerAccount', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {
        name: 'Test Name',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
      files: {
        image: {
          mimetype: 'image/png',
          size: 1024 * 1024 * 4,
          name: 'test.png',
          mv: sandbox.stub().resolves(),
        },
      },
    };
    res = {
      json: sandbox.spy(),
      locals: {
        user: 'testUser',
      },
    };
    sandbox.stub(CONTROLLER_SCHEMA, 'create').resolves({ id: 'testId' });
    sandbox.stub(bucket, 'upload').resolves();
    sandbox.stub(bucket, 'file').returns({ name: 'testfile' });
    sandbox.stub(fs, 'unlinkSync');
    sandbox.stub(badRequestError);
    sandbox.stub(generateRandomString).returns('randomString');
    sandbox.stub(createUserToken).returns('testToken');
    sandbox.stub(attachCookieToResponse);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return error if name is missing', async () => {
    req.body.name = '';
    await createControllerAccount(req, res);
    expect(badRequestError).to.have.been.calledWith(res, 'pleaseProvideName ');
  });

  it('should return error if username is missing', async () => {
    req.body.username = '';
    await createControllerAccount(req, res);
    expect(badRequestError).to.have.been.calledWith(
      res,
      'pleaseProvideUsername '
    );
  });

  it('should return error if password is missing', async () => {
    req.body.password = '';
    await createControllerAccount(req, res);
    expect(badRequestError).to.have.been.calledWith(
      res,
      'pleaseProvidePassword '
    );
  });

  it('should return error if image mimetype is not valid', async () => {
    req.files.image.mimetype = 'application/pdf';
    await createControllerAccount(req, res);
    expect(badRequestError).to.have.been.calledWith(res, 'pleaseProvideImage');
  });

  it('should return error if image size is too large', async () => {
    req.files.image.size = 1024 * 1024 * 6;
    await createControllerAccount(req, res);
    expect(badRequestError).to.have.been.calledWith(
      res,
      'pleaseProvideImageThatSizeIsLessThan5MB'
    );
  });

  it('should successfully create user and return token', async () => {
    await createControllerAccount(req, res);
    expect(CONTROLLER_SCHEMA.create).to.have.been.called;
    expect(bucket.upload).to.have.been.called;
    expect(fs.unlinkSync).to.have.been.called;
    expect(res.json).to.have.been.calledWith({
      data: 'testToken',
      msg: '',
      authenticatedUser: 'testUser',
    });
  });

  // Add more tests to cover additional scenarios if necessary.
});
