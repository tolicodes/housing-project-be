const router = require('express').Router();
const auth = require('../auth/parseHeader');
const models = require('../models');

router.get('/:id', auth.required, ({
    params: {
        id
    }
}) => {
    res.json(models.findByPk(id));
});

router.post('/', auth.required, async ({
        user: {
            id: userId
        },
        body: {
            name,
            preapprovalAmount,
            neighborhoods,
            city,
        }
    },
    res
) => {
    const borrower = await models.borrower.create({
        userId,
        name,
        preapprovalAmount,
        neighborhoods,
        city,
    });

    if (borrower) {
        neighborhoods.forEach(hood => {
            console.log(Object.keys(borrower))
            borrower.createBorrower_neighborhood({
                city,
                name: hood
            });
        })

        res.json(borrower);
    } else {
        res.status(400).json({
            error: 'Could not create user',
        });
    }
})

module.exports = router;