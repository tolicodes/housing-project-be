const router = require('express').Router();
const auth = require('../auth/parseHeader');
const models = require('../models');

router.delete('/:id', ({
    params: {
        id
    }
}, res) => {
    await models.borrower.destroy({
        where: {
            id,
        }
    })
});

router.put('/:id', async ({
    params: {
        id
    },
    body: {
        name,
        preapprovalAmount,
        neighborhoods,
        city,
    }
}, res) => {
    const borrower = await models.borrower.findByPk(id);

    await borrower.update({
        name,
        preapprovalAmount
    });

    res.json(borrower);
})

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