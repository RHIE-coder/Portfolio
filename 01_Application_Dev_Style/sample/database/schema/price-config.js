module.exports = {
    name: 'price-config',

    schema: {
        username: String,

        data: {
            price_config_name: String,
            country: String,
            exchange_rate: Number,

            delivery_charge: Number,
            delivery_exchange_charge: Number,
            delivery_return_charge: Number,

            before_discount_price: Number,
            before_discount_price_additions: [{
                property: String,
                value_num: Number,
                unit: String,
            }],

            present_price: Number,
            present_price_additions: [{
                property: String,
                value_num: Number,
                unit: String,
            }],

            created_date: { type: Date, default: Date.now },
            updated_date: { type: Date, default: Date.now },
        }
    },
    static: [
        findItems,
        findItem,
        saveItem,
        deleteItem,
    ]
};

function findItems(username){
    return this.find({username}).exec(); //mongoose exec() return promise
}

function findItem(username, price_config_name){
    return this.findOne({username})
                    .where('data.price_config_name')
                    .equals(price_config_name)
                    .exec();
}

function saveItem(username, data){
    const item = new this({
        username,
        data,
    })

    return item.save(); //mongoose save() return promise
}


function deleteItem(username, price_config_name){
    return this.deleteOne().and({username},{'data.price_config_name':price_config_name}).exec()
}