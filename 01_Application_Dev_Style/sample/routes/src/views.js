const router = require('express').Router();

module.exports = {
    routers,
}

function routers() {

    // 전체보기
    router.get('/',(req, res) => {
        res.render('home.html');
    });

    // 가격설정
    router.get('/settings/price',(req, res) => {
        res.render('settings_price.html');
    });

    // 마켓설정
    router.get('/settings/market',(req, res) => {
        res.render('settings-market.html');
    });

    // 상품관리
    router.get('/management/product',(req, res) => {
        res.render('management-product.html');
    });

    // 프로필
    router.get('/profile',(req, res) => {
        res.render('profile.html');
    });

    // 로그인
    router.get('/login',(req, res) => {
        res.render('login.html');
    });

    return router
}

