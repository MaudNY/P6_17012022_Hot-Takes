const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
      ...thingObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
    });
    // Capture et enregistre l'image
    sauce.file.save()
    // analyse la sauce transformée en chaîne de caractères et l'enregistre dans la base de données (en définissant correctement son imageUrl)
        .then(analyse => {
            const imageUrl = {imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
            sauce.save()
        })
    
    // Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides

    // NB : Remarquez que le corps de la demande initiale est vide... Lorsque multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier.
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json([sauces]))
        .catch(error => res.status(400).json({ error }));
};