const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth/parseHeader');
const { Users } = require('../models');

require('../auth/passport');

const errorJSON = ((error, res) => (
    res.status(422).json({
        error,
    })
))

router.post('/', auth.optional, async (req, res, next) => {
    const {
        body: {
            email,
            password
        }
    } = req; 

    if (!email) return errorJSON('Email is required');
    if (!password) return errorJSON('Password is required', res);

    const [user, created] = await Users.findOrCreate({
        where: { email }
    });

    if (!created) return errorJSON('User already exists', res);

    user.setPassword(password);

    await user.save();

    return res.json({
        user: user.toAuthJSON()
    });
});

router.post('/login', auth.optional, (req, res, next) => {
    const {
        body: {
            email,
            password
        }
    } = req;

    if (!email) return errorJSON('Email is required');
    if (!password) return errorJSON('Password is required', res);

    return passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (user) {
            user.token = user.generateJWT();

            return res.json({
                user: user.toAuthJSON()
            });
        }

        return res.sendStatus(400).json(info);
    })(req, res, next);
});

router.get('/current', auth.required, async (req, res, next) => {
    const {
        body: { id }
    } = req;

    console.log(id);

    const user = await Users.findByPk(id);
        if (!user) {
            return res.sendStatus(400);
        }

        return res.json({
            user: user.toAuthJSON()
        });
});

module.exports = router;