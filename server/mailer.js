
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
        host: config.mail_host,
        port: config.mail_port,
        secure: true,
        auth: {
            user: config.mail_user,
            pass: config.mail_pass
        }
    });
}
if (config.mail_type == 'aws-ses'){
    /*
     Amazon SES - Send Simple Email
     Note: nodemailer-ses-transport should be installed. this is an amazon specific module
    */
    // aws.config = {
    //     accessKeyId: config.mail_aws_ses_key_id,
    //     secretAccessKeyx: config.mail_aws_ses_key_secret,
    //     region: 'us-west-2'
    // }
    transporter = nodemailer.createTransport({
        SES: new aws.SES({
            apiVersion: '2010-12-01',
            region: 'us-west-2'
        })
    });
}

module.exports = transporter;
