const express = require("express");
const { request: httpRequest } = require("http");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const envioCorreo = (req = request, resp = response) => {
  let body = req.body;

  let listaCorreos = body.email;

  let config = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const opciones = {
    from: "Prueba",
    subject: body.asunto,
    to: listaCorreos,
    text: body.mensaje,
  };

  config.sendMail(opciones, function (error, result) {
    if (error) return resp.json({ ok: false, msg: error });

    return resp.json({
      ok: true,
      msg: result,
    });
  });
};

module.exports = {
  envioCorreo,
};
