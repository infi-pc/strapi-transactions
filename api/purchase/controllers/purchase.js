'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {

        return await strapi.connections.default.transaction(async transacting => {
            const amountToTake = ctx.request.body.Amount
            const purchaseResponse = await strapi.query("purchase").create(ctx.request.body, {transacting});

            // const editRes = await strapi.plugins['users-permissions'].services.user.edit({ id: 1 }, { credit: 333 }, {});
            const user = await strapi.query('user', 'users-permissions').findOne({ id: 1 }, null, {transacting});
            const availableCredit = user.Credit
            if (availableCredit < amountToTake) {
                throw new Error("Not enough credits")
            }
            await strapi.query('user', 'users-permissions').update({ id: 1 }, { Credit: availableCredit - amountToTake }, {transacting});

            return purchaseResponse
        });
    },
};
