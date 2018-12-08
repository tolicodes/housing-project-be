const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth/parseHeader');
const models = require('../models');

require('../auth/passport');

const linkedInAuth = passport.authenticate('linkedin');
const googleAuth = passport.authenticate('google', { scope: ['profile'] });
const facebookAuth = passport.authenticate('facebook');

const errorJSON = ((error, res) => (
    res.status(422).json({
        error,
    })
));

router.get('/', auth.required, async (req, res) => {
   const users = await models.user.findAll({
    include: [ { model: models.borrower, as: 'borrowers', include: [models.borrower_neighborhood] } ],
   });
   res.json(users.map(({
       email,
       nmls_number,
       name,
       phone,
       company,
       borrowers,
   }) => ({
        email,
        nmls_number,
        name,
        phone,
        company,
        borrowers,
        })
    ));
});

router.post('/', auth.optional, async (req, res, next) => {
    try {
        const {
            body: {
                email,
                password,
                name,
                phone,
                company,
                nmls_number,
                google_id,
                fb_id,
                li_id,
            }
        } = req; 

        if (!email) return errorJSON('Email is required');
        if (!password && !google_id && !fb_id && !li_id) return errorJSON('Password is required', res);
        if (!name) return errorJSON('Name is required', res);
        if (!phone) return errorJSON('Phone is required', res);
        if (!company) return errorJSON('Company is required', res);
        if (!nmls_number) return errorJSON('nmls Number is required', res);

        const [user, created] = await models.user.findOrCreate({
            where: { email },
            defaults: {
                name,
                phone,
                company,
                nmls_number,
                fb_id,
                google_id,
                li_id,
            }
        });

        if (!created) return errorJSON('User already exists', res);

        user.setPassword(password);

        await user.save();

        return res.json({
            user: user.toAuthJSON()
        });
    } catch (e) {
        console.error(e)
    }
});

router.post('/login', auth.optional, (req, res, next) => {
    const {
        body: {
            email,
            password
        }
    } = req;

    if (!email) return errorJSON('Email is required', res);
    if (!password) return errorJSON('Password is required', res);

    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (!user) return res.status(400).json(info);

        user.token = user.generateJWT();

        return res.json({
            user: user.toAuthJSON()
        });
    })(req, res, next);
});

router.get('/current', auth.required, async ({ user: { id } }, res, next) => {
    const user = await models.user.findByPk(id);
        if (!user) return res.status(400).json({ error: 'Invalid user' })

        return res.json({
            user: user.toAuthJSON()
        });
});

const socialCallback = (provider, getUserDetails) => (req, res) => {
  const io = req.app.get('io')
  const user = getUserDetails(req);

  io.in(req.session.socketId).emit(provider, user);

  res.json({
      done: true
  });

}

router.get('/linkedin/callback', linkedInAuth, socialCallback('linkedin', ({ user: { exists, id, name: { familyName, givenName }}}) => ({
    name: givenName + ' ' + familyName,
    id,
    exists,
})));

router.get('/google/callback', googleAuth, socialCallback('google', ({ user: { exists, displayName, id}}) => ({
    name: displayName,
    id,
    exists
})));

router.get('/facebook/callback', facebookAuth, socialCallback('facebook', ({ user: { exists, displayName, id }}) => ({
    name: displayName,
    id,
    exists,
})));

router.use((req, res, next) => {
    req.session.socketId = req.query.socketId
    next()
  });

router.get('/linkedin', linkedInAuth);
router.get('/google', googleAuth);
router.get('/facebook', facebookAuth);

module.exports = router;