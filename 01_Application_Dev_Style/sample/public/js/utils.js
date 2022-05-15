export const add_click_event = async (selector, callback, is_element) => { 
    is_element = is_element ?? false
    
    if(is_element){
        selector.addEventListener("click", callback);
    }else if(selector.startsWith(".")){
        [...document.getElementsByClassName(selector.substr(1))].forEach(element=>{
            element.addEventListener("click", callback);
        })
    }else if(selector.startsWith("#")){
        document.getElementById(selector.substr(1)).addEventListener("click", callback);
    }
}

export const get_template_fragment_clone = async (template_id) => document.getElementById(template_id).content.cloneNode(true)