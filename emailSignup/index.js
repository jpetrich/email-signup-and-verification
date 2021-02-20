const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

function getRandomInt () {
  return Math.floor(Math.random() * 100000);
}

exports.main = (req, res) => {
  if (req.method != 'POST') {
    return res.status(405).send({ error: 'Method not supported'})
  }
 
  // store/insert a new document
  const data = (req.body) || {};
  const email = data.email;
  const verificationCode = getRandomInt() + encodeURIComponent(email) + getRandomInt();
  const created = new Date().getTime();
  const isVerified = false;
  const docRef = db.collection('users').doc(email);
  docRef.set({
    'created': created,
    'email': email,
    'verificationCode': verificationCode,
    'isVerified': isVerified
  }).then(() => {
    const nodeMailer = require("nodemailer");
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        serviceClient: process.env.CLIENT_ID,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
      }
    });
    const verificationLink = `${process.env.VERIFICATION_BASE_URL}?email=${encodeURIComponent(email)}&verificationCode=${encodeURIComponent(verificationCode)}`;
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Verify your email address for joepetrich.com',
      text: `Please verify your email address to receive emails from joepetrich.com by clicking on this link: ${verificationLink}`
    };
    transporter
      .sendMail(mailOptions)
      .then(() => {
        res.status(200).send({ 'email': email, 'isVerified': isVerified});
      })
      .catch(e => {
        res.status(500).send({
          error: {
            code: 500,
            message: e.toString()
          }
        });
      });  
  }).catch(reason => {
    console.error(reason);
    return res.status(500).send({ error: 'unable to signup', err });
  });
}
