const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId: req.token.userId
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyOneSauce = (req, res) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if (sauceObject.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Requête non autorisée !' });
    }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                res.status(404).json({ error });
            } if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: 'Requête non autorisée !' });
            }
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.reactToSauce = (req, res) => {
    if (req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(sauce.userId)) {
                    sauce.updateOne({
                        $pull: { usersLiked: sauce.userId },
                        $inc: { likes: -1 }
                    })
                    .then(() => res.status(200).json({ message: 'Like supprimé' }))
                    .catch(error => res.status(404).json({ error }));
                } if (sauce.usersDisliked.includes(sauce.userId)) {
                    sauce.updateOne({
                        $pull: { usersDisliked: sauce.userId},
                        $inc: { dislikes: -1 }
                    })
                    .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
                    .catch(error => res.status(404).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
    } if (req.body.like === 1) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                sauce.updateOne({
                    $push: { usersLiked: sauce.userId },
                    $inc: { likes: 1 }
                })
                    .then(() => res.status(201).json({ message: 'Sauce likée !' }))
                    .catch(error => res.status(404).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } if (req.body.like === -1) {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            sauce.updateOne({
                $push: { usersDisliked: sauce.userId },
                $inc: { dislikes: 1 }
            })
                .then(() => res.status(201).json({ message: 'Sauce dislikée...' }))
                .catch(error => res.status(404).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};