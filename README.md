# Email signup and verification through Google Cloud Functions

These two cloud functions - `emailSignup` and `emailVerification` allow you to implement your own
email signup and verification service hosted on Google Cloud. There are two ways to try thsee
functions out - you can use the `gcloud` command line tool to deploy the functions to your own
Google Cloud project, or you can use the Google Cloud console web UI to paste the `index.js` and
`package.json` files into cloud functions you create there. In either case, there are a couple of
prerequisites:

1. Enable the Cloud Firestore API on your Google Cloud project (the same one as you will use for cloud functions).
1. Enable API access to your gmail account, generate an OAuth key, and save the client ID and private key for use as an environment variable. You can read more about auth, the `nodemailer` package, and how to set up access [here](https://nodemailer.com/smtp/oauth2/).

In addition, make sure you understand how billing works for Cloud Functions and Cloud Firestore. The free limits are
pretty high, but if you anticipate a high volume of signups, you might consider using Google App Engine or hosting
a webserver and database yourself (on the cloud or otherwise).

The environment variables required to make these functions work are:

* EMAIL_ADDRESS - the email address you want verification emails to be sent *from*
* CLIENT_ID - the service account client ID generated when you set up access to Gmail (or another email service)
* PRIVATE_KEY - the private key generated when you set up a service account for access to Gmail

You can set the environment variables either through the Cloud Console UI or using `gcloud`. Documentation for
both options is found [here](https://cloud.google.com/functions/docs/env-var#gcloud).

## Quick Start

1. Download or clone this repository.
2. [Install and set up Google Cloud SDK](https://cloud.google.com/sdk/docs/install#linux).
3. Enable Cloud Functions and Cloud Firestore on a Google Cloud project.
4. Set the active Google Cloud project using `gcloud config set project [MY_PROJECT_ID]`
5. `cd` into either `emailSignup` or `emailVerification`.

Now, to run locally:

6. Run `npm install` to install the dependencies.
7. Run `npm start`

To deploy to Google Cloud

6. Run `gcloud functions deploy [emailVerification | emailSignup] --trigger-http --runtime nodejs10 --region [YOUR_REGION] --entry-point main --update-env-vars [YOUR_ENVIRONMENT_VARIABLE=YOUR_VALUE...]`

If specifying the environment variables on the command line isn't your cup of tea, you can log in to the Google Cloud Console, edit your function, and add environment variables there.

Note: you need, at a minimum, to specify the `CLIENT_ID`, `EMAIL_ADDRESS`, and `PRIVATE_KEY` to authenticate with Gmail to send the verification email for `emailSignup`, and `SIGNUP_REDIRECT_URL` if you want the user to be redirected to the specified URL on a successful signup. For `emailVerification` you need to specify `VERIFY_REDIRECT_URL` if you want the user to be redirected to a URL after verifying their email address. Alternatively, modify the functions to return a 200 or an HTML success page if you don't want the user to be redirected.