var events = require("events");
const env = require("../config/.env");
var eventEmitter = new events.EventEmitter();
const db = require("../config/db.config.js");
const Oficina = db.oficina;
const googleMapsClient = require("@google/maps").createClient({
	key: env.cloudApiKey
});

exports.create = async function(req, res) {
	await googleMapsClient.geocode({ address: req.body.endereco }, function(
		err,
		response
	) {
		if (!err) {
			if (response.json.status === "ZERO_RESULTS") {
				res.status(400).send("Endereço mal formatado");
			} else {
				const ret = response.json.results[0].geometry.location;
				eventEmitter.addListener("coords", dbInsert(req, res, ret));
				eventEmitter.emit("coords");
			}
		} else {
			res.status(400).send("Endereco vazio");
		}
	});
};

async function dbInsert(req, res, data) {
	const profileData = req.body;
	try {
		const oficina = await Oficina.create({
			...profileData,
			latitude: data.lat,
			longitude: data.lng
		});
		console.log(oficina);
		res.status(201).send(oficina);
	} catch (err) {
		res.status(400).send("erro");
		console.log(err);
	}
}

exports.getOficinaGeocodeById = async function(req, res) {
	const id = req.params.id;
	try {
		const oficina = await Oficina.findOne({ where: { id: id } });
		if (oficina) {
			const latitude = oficina.latitude;
			const longitude = oficina.longitude;
			const location = { latitude, longitude };
			res.status(200).send(location);
		}
		res.status(400).send("Oficina não encontrada");
	} catch (err) {
		res.status(500).send(err);
	}
};

exports.findById = async function(req, res) {
	const id = req.params.id;
	try {
		const oficina = await Oficina.findOne({ where: { id: id } });
		if (oficina) {
			res.status(200).send(oficina);
		}
		res.status(400).send("Oficina não encontrada");
	} catch (err) {
		res.status(500).send(err);
	}
};
exports.update = async function(req, res) {
	const id = req.params.id;
	const profileData = req.body;
	try {
		const oficina = await Oficina.findOne({ where: { id: id } });
		if (oficina) {
			await Oficina.update(profileData, { where: { id: id } });
			res.status(200).send("atualizado");
		} else {
			res.status(400).send("Oficina não existe");
		}
	} catch (err) {
		res.status(500).send(err);
	}
};
exports.findAll = (req, res) => {
	Oficina.findAll({}).then(oficina => {
		res.status(201);
		res.send(oficina);
	});
};
exports.getOficinaByCidade = async function(req, res) {
	const cidade = req.params.cidade;
	try {
		const oficina = await Oficina.findAll({ where: { cidade: cidade } });
		if (oficina.length > 0) {
			res.status(200).send(oficina);
		} else {
			res.status(400).send("Não há oficinas na sua região");
		}
	} catch (err) {
		res.status(500).send(err);
	}
};