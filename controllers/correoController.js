const express = require("express");
const { request: httpRequest } = require("http");
const fs = require("fs");
const path = require("path");
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

  const templatePath = path.resolve(__dirname, "../emailTemplate.html"); // Ajusta la ruta si es necesario
  let emailTemplate = fs.readFileSync(templatePath, "utf8");

  // Obtener el mensaje desde el cuerpo de la solicitud
  let mensaje = body.mensaje || "Mensaje predeterminado";
  emailTemplate = emailTemplate.replace("{{mensaje}}", mensaje);

  const opciones = {
    from: `"Picahuesos Básquet Club" <${process.env.SMTP_USER}>`,
    subject: body.asunto,
    to: listaCorreos,
    text: body.mensaje,
    html: emailTemplate,
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
