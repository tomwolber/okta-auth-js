/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


const express = require('express');

const { 
  getAuthClient, 
  handleTransaction,
  renderTemplate,
  renderPage,
} = require('../utils');

const router = express.Router();

// Handle select-authenticator
router.get('/select-authenticator', (req, res) => {
  const { 
    idx: { nextStep: { options, canSkip } }
  } = req.getFlowStates();
  renderPage({ 
    req, res,
    render: () => renderTemplate(req, res, 'select-authenticator', {
      options,
      action: '/select-authenticator',
      canSkip,
      skipAction: '/select-authenticator/skip'
    })
  });
});

router.post('/select-authenticator', async (req, res, next) => {
  try {
    const { authenticator } = req.body;
    const authClient = getAuthClient(req);
    const transaction = await authClient.idx.proceed({ authenticator });
    handleTransaction({ req, res, next, authClient, transaction });
  } catch (err) {
    next(err);
  }
});

router.post('/select-authenticator/skip', async (req, res, next) => {
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ skip: true });
  handleTransaction({ req, res, next, authClient, transaction });
});

// Handle challenge email authenticator
router.get('/challenge-authenticator/okta_email', (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      title: 'Challenge email authenticator',
      input: {
        type: 'text',
        name: 'verificationCode',
      },
      action: '/challenge-authenticator/okta_email',
    })
  });
});

router.post('/challenge-authenticator/okta_email', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ verificationCode });
  handleTransaction({ req, res, next, authClient, transaction });
});  

// Handle enroll authenticator -- email
router.get('/enroll-authenticator/okta_email', (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      req, res,
      title: 'Enroll email authenticator',
      action: '/enroll-authenticator/okta_email',
      input: {
        type: 'text',
        name: 'verificationCode',
      }
    })
  });
});

router.post('/enroll-authenticator/okta_email', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ verificationCode });
  handleTransaction({ req, res, next, authClient, transaction });
});

// Handle enroll authenticator -- password
router.get('/enroll-authenticator/okta_password', (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'enroll-or-reset-password-authenticator', {
      title: 'Set up password',
      action: '/enroll-authenticator/okta_password',
    })
  });
});

router.post('/enroll-authenticator/okta_password', async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const authClient = getAuthClient(req);
  if (password !== confirmPassword) {
    // TODO: handle validation in middleware
    next(new Error('Password not match'));
    return;
  }

  const transaction = await authClient.idx.proceed({ password });
  handleTransaction({ req, res, next, authClient, transaction });
});

// Handle phone authenticator
router.get('/verify-authenticator/phone_number', (req, res) => {
  const { 
    idx: { nextStep: { options } } 
  } = req.getFlowStates();
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'verify-phone', {
      title: 'Verify using phone authenticator',
      action: '/verify-authenticator/phone_number',
      options,
    })
  });
});

router.post('/verify-authenticator/phone_number', async (req, res, next) => {
  const { methodType } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ methodType });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/challenge-authenticator/phone_number', (req, res) => {
  const { 
    idx: { nextStep: { canResend } }
  } = req.getFlowStates();
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      title: 'Challenge phone authenticator',
      input: {
        type: 'text',
        name: 'verificationCode',
      },
      action: '/challenge-authenticator/phone_number',
      canResend,
      resendAction: '/challenge-authenticator/resend'
    })
  });
});

router.post('/challenge-authenticator/phone_number', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ verificationCode });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.post('/challenge-authenticator/resend', async (req, res, next) => {
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ resend: true });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/enroll-authenticator/phone_number/enrollment-data', (req, res) => {
  const { 
    idx: { nextStep: { options } } 
  } = req.getFlowStates();
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'phone-enrollment-data', {
      action: '/enroll-authenticator/phone_number/enrollment-data',
      options,
    })
  });
});

router.post('/enroll-authenticator/phone_number/enrollment-data', async (req, res, next) => {
  const { phoneNumber, methodType } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ 
    methodType,
    phoneNumber,
  });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/enroll-authenticator/phone_number', (req, res) => {
  const { 
    idx: { nextStep: { canResend } }
  } = req.getFlowStates();
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      title: 'Enroll phone authenticator',
      action: '/enroll-authenticator/phone_number',
      input: {
        type: 'text',
        name: 'verificationCode',
      },
      canResend,
      resendAction: '/challenge-authenticator/resend'
    })
  });
});

router.post('/enroll-authenticator/phone_number', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ 
    verificationCode,
  });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/enroll-authenticator/okta_verify/enroll-poll', async (req, res) => {
  const { 
    idx: { 
      nextStep: { pollForResult }
    }
  } = req.getFlowStates();
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'enroll-poll', {
      title: 'Enroll Okta Verify',
      action: '/enroll-authenticator/okta_verify/enroll-poll',
      pollForResult,
    })
  });
});

router.post('/enroll-authenticator/okta_verify/enroll-poll', async (req, res, next) => {
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.poll();
  handleTransaction({ req, res, next, authClient, transaction });
});

// Handle Google Authenticator
router.get('/enroll-authenticator/google_otp', async (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      req, res,
      title: 'Enroll Google Authenticator',
      action: '/enroll-authenticator/google_otp',
      input: {
        type: 'text',
        name: 'verificationCode',
      }
    })
  });
});

router.post('/enroll-authenticator/google_otp', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ verificationCode });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/challenge-authenticator/google_otp', async (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator', {
      title: 'Challenge Google Authenticator',
      input: {
        type: 'text',
        name: 'verificationCode',
      },
      action: '/challenge-authenticator/google_otp',
    })
  });
});

router.post('/challenge-authenticator/google_otp', async (req, res, next) => {
  const { verificationCode } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ verificationCode });
  handleTransaction({ req, res, next, authClient, transaction });
});

// Handle Security Question authenticator
router.get('/enroll-authenticator/security_question', async (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator-security_question', {
      req, res,
      title: 'Enroll security question authenticator',
      action: '/enroll-authenticator/security_question',
      input: {
        type: 'text',
        name: 'answer',
      }
    })
  });
});

router.post('/enroll-authenticator/security_question', async (req, res, next) => {
  const { questionKey, question, answer } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ questionKey, question, answer });
  handleTransaction({ req, res, next, authClient, transaction });
});

router.get('/challenge-authenticator/security_question', async (req, res) => {
  renderPage({
    req, res,
    render: () => renderTemplate(req, res, 'authenticator-security_question', {
      title: 'Challenge security question',
      input: {
        type: 'text',
        name: 'answer',
      },
      action: '/challenge-authenticator/security_question',
    })
  });
});

router.post('/challenge-authenticator/security_question', async (req, res, next) => {
  const { answer } = req.body;
  const authClient = getAuthClient(req);
  const transaction = await authClient.idx.proceed({ answer });
  handleTransaction({ req, res, next, authClient, transaction });
});

module.exports = router;
