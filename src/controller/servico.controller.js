const db = require("../config/db.config.js");
const Servico = db.servico;
var jwt = require('jsonwebtoken');
require("dotenv-safe").load();

exports.create = async function(req, res) {
    const profileData = req.body;
    try {
        const servico = await Servico.create(profileData);
        res.status(201).send(servico);
    } catch (err){
        res.status(500).send(err);
    }
}
exports.update = async function(req, res) {
        const servico = await Servico.update({
            nomeServico: req.body.nomeServico
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).send(servico);
}
exports.findById = async function(req, res) {
    const id = req.params.id;
    try {
        const servico = await servico.findById({
            where: {
                id: id
            }
        });
        if (servico) {
            res.status(200).send(servico);
        }
        res.status(404).send({
            alert: "Serviço não encontrado"
        });
        
    } catch(err) {
        res.status(500).send(err);
    }
}