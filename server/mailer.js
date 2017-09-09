
//const express = require('express');
const config = require('./config');

const nodemailer = require('nodemailer');
let aws = require('aws-sdk');

const mail_type = config.mail_type;
let transporter = null;

if (config.mail_type == 'smtp'){
    /*
     SMTP - Localhost, Google, Yahoo etc..
    */
    transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port
    });
}
if (config.mail_type == 'smtp_auth'){
    /*
     SMTP - Localhost, Google, Yahoo etc..
    */
    transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port,
        auth: {
            user: config.smtp_auth_user,
            pass: config.smtp_auth_pass
        }
    });
}
if (config.mail_type == 'aws_ses'){
    /*
     Amazon SES - Send Simple Email
    */
    transporter = nodemailer.createTransport({
        SES: new aws.SES(
            {
                apiVersion: '2010-12-01',
                accessKeyId: config.aws_iam_id,
                secretAccessKey: config.aws_iam_key,
                region: config.aws_ses_region
            }
        )
    });
}

module.exports = transporter;
