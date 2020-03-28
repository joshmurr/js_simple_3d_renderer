export default class GUI {
    constructor(){
        this.body = document.getElementsByTagName("body")[0];
        this.id_list = [];
    }

    getIdList(){
        return this.id_list;
    }


    menu(){
        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "menu";
        this.menuContainer.classList.add("menuContainer");
        this.body.appendChild(this.menuContainer);
    }

    title(_title){
        let title = document.createElement("div");
        title.classList.add("title");
        title.textContent = _title;
        this.menuContainer.appendChild(title);
    }

    button(_text){
        let button = document.createElement("button");
        // button.classList.add("button");
        button.textContent = _text;
        this.menuContainer.appendChild(button);
    }

    slider(id=null, _min, _max, _val){
        let sliderContainer = document.createElement("div");
        let slider = document.createElement("input");
        if(id) slider.id = String(id);
        this.id_list.push(slider.id);
        slider.classList.add("slider");
        slider.type = "range";
        slider.min = _min;
        slider.max = _max;
        slider.value = _val;
        this.menuContainer.appendChild(slider);
    }

    input(){
        let input = document.createElement("input");
        input.classList.add("input");
        input.type = "text";
        input.value = 0;
        this.menuContainer.appendChild(input);
    }

}
