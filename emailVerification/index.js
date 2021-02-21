const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.main = (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).send({ error: 'Method not supported'})
  }

  console.log(req.query);
  const submittedCode = req.query.verificationCode;
  const submittedEmail = req.query.email;
  console.log('Submitted code: ' + submittedCode);
  console.log('Submitted email: ' + submittedEmail);

  const userRef = db.collection('users').doc(submittedEmail);
  userRef.get().then(doc => {
    if (!doc.exists) {
      console.log('No user found for email ' + submittedEmail);
      return res.status(404).send({ error: 'Email not found'})
    }
    
    console.log('User data:', doc.data());
    const userVerificationCode = doc.data().verificationCode;

    if (userVerificationCode != submittedCode) {
      return res.status(401).send({ error: 'Incorrect verification code: ' + submittedCode});
    }

    userRef.update({
      'isVerified': true
    }).then(result => {
      console.log(`Updated record at ${result.writeTime}`);
      return res.redirect(process.env.VERIFY_REDIRECT_URL);
    });
  })

}
