module.exports = {
    name: 'market-config',

    schema: {
        username: String,

        data: {
            market_config_name: String,
            market_name: String,

            api_info: {
                vendor_user_id: String,
                vendor_id: String,
                access_key: String,
                secret_key: String,
            },

            outbound_shipping_place_code: String,
            return_center_code: String,

            outbound_shipping_time_day: Number, //출고 소요일
            maximum_buy_for_person: Number, //인당 최대 구매 수량
            maximum_buy_for_person_period: Number, //최대 구매 수량 기간
            pcc_needed: Boolean,

            price_config_name: String,

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