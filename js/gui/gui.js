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

    button(id, _text){
        let button = document.createElement("button");
        button.id = id;
        this.id_list.push(button.id);
        button.value = 0;
        button.textContent = _text;
        button.onclick = function(){
            this.value++;
        }
        this.menuContainer.appendChild(button);
    }

    slider(id, _min, _max, _val){
        let sliderContainer = document.createElement("div");
        let slider = document.createElement("input");
        slider.id = String(id);
        this.id_list.push(slider.id);
        slider.classList.add("slider");
        slider.type = "range";
        slider.min = _min;
        slider.max = _max;
        slider.value = _val;
        slider.step = 0.1;
        this.menuContainer.appendChild(slider);
    }

    input(){
        let input = document.createElement("input");
        input.classList.add("input");
        input.type = "text";
        input.value = 0;
        this.menuContainer.appendChild(input);
    }

    dropdown(id, args){
        let dropdown = document.createElement("select");
        dropdown.id = String(id);
        this.id_list.push(dropdown.id);
        // dropdown.classList.add(
        for(let i=0; i<args.length; i++){
            let option = document.createElement("option");
            option.textContent = args[i];
            option.value = args[i].toLowerCase();
            if(!i) option.selected = "selected";
            dropdown.appendChild(option);
        }
        this.menuContainer.appendChild(dropdown);

    }

}
