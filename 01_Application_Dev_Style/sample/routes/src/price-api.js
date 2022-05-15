const router = require('express').Router();
const message = require('../../lib/message');
const {not_logined_redirect_login} = require("../../middleware/access_control");

module.exports = {
    routers,
    path: "/settings/price",
}

function routers() {
    router.get('/infos', not_logined_redirect_login, async (req, res) => {
        const username = req.user.username;
        const PriceConfig = req.app.get('db_model_list')['price-config'];

        const infos = await PriceConfig.findItems(username);

        const resBody = {}

        if (infos) { 
            resBody.result = message.SUCCESS;
            resBody.data = infos.map(info => info.data)
        }else{ 
            resBody.result = message.NO_DATA; 
        }

        res.send(resBody);
    });

    router.get('/infos/:configname', not_logined_redirect_login, async (req, res) => {
        const username = req.user.username;
        const PriceConfig = req.app.get('db_model_list')['price-config'];
        const price_config_name = req.params.configname;

        const resBody = {};

        if(!price_config_name){
            resBody.result = message.INSUFFICIENCY;
            res.send(resBody);
            return
        }

        const info = await PriceConfig.findItem(username, price_config_name);

        if (info) { 
            resBody.result = message.SUCCESS;
            resBody.data = info.data;
        }else{ 
            resBody.result = message.NO_DATA;
        }
        res.send(resBody);
    });

    router.post('/infos', not_logined_redirect_login, async (req, res) => {
        const username = req.user.username;
        const PriceConfig = req.app.get('db_model_list')['price-config'];
        const resBody = {};

        if(!req.body.price_config_name){
            resBody.result = message.INSUFFICIENCY;
            res.send(resBody);
            return
        }

        const isExist = await PriceConfig.findItem(username, req.body.price_config_name);

        if(isExist){
            resBody.result = message.EXIST_ALEADY;
        }else{
            const save_result = PriceConfig.saveItem(username, req.body);
            if(save_result){
                resBody.result = message.SUCCESS;
            }else{
                resBody.result = message.ERROR;
            }
        }
        res.send(resBody)
    });

    router.put('/infos', not_logined_redirect_login, async (req, res) => {
        const username = req.user.username;
        const PriceConfig = req.app.get('db_model_list')['price-config'];
        const resBody = {};

        if(!req.body.before_title && !req.body.data.price_config_name){
            resBody.result = message.INSUFFICIENCY;
            res.send(resBody);
            return
        }

        const update_target = await PriceConfig.findItem(username, req.body.previous_config_name);
        Object.assign(update_target.data, req.body.data);
        update_target.data.updated_date = new Date();

        if(update_target){
            const save_result = await update_target.save();
            if(save_result){
                resBody.result = message.SUCCESS;
            }else{
                resBody.result = message.ERROR;
            }
        }else{
            resBody.result = message.NO_DATA;
        }
        
        res.send(resBody);
    });

    router.delete('/infos/:configname', not_logined_redirect_login, async (req, res) => {
        const username = req.user.username;
        const PriceConfig = req.app.get('db_model_list')['price-config'];

        const resBody = {};

        const price_config_name = req.params.configname;

        if(!price_config_name){
            resBody.result = message.INSUFFICIENCY;
            res.send(resBody);
            return
        }

        const delete_result = await PriceConfig.deleteItem(username, price_config_name);

        if(delete_result.deletedCount > 0){
            resBody.result = message.SUCCESS;
        }else{
            resBody.result = message.ERROR;
        }
        res.send(resBody);
    });

    return router;
}
