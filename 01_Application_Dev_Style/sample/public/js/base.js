import {add_click_event} from "./utils.js";

export async function set_events(){
    await Promise.all([
        add_click_event("#overview-page", () => { window.location = '/' }),
        add_click_event("#price-setting-page", () => { window.location = '/settings/price' }),
        add_click_event("#market-setting-page", () => { window.location = '/settings/market' }),
        add_click_event("#prod-mng-page", () => { window.location = '/management/product' }),
        add_click_event("#profile", () => { window.location = '/profile' }),
    ]);
}

// 현재 위치한 웹페이지 메타정보를 저장
export async function update_webpage(){
    const page_name = document.getElementById('web-page-name').textContent
    localStorage.setItem("sample-current-page", page_name)
    console.log(page_name);
}

// 현재 위차한 웹페이지 메타정보와 저장된 웹페이지 정보를 비교해 웹페이지 변경이 있으면 스토리지 clear
export async function check_webpage_origin(){
    const page_name = document.getElementById('web-page-name').textContent
    if(localStorage.getItem("sample-current-page") !== page_name){
        localStorage.clear();
    }
}
