class CalcController {

    constructor() {

        //_ = private
        this._audio = new Audio("click.mp3");
        this._audioOnOff = false;
        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._locale = "pt-br";
        this._displayCalcEl = document.querySelector("#display");
        this._operationEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonEvents();
        this.initKeyboard();

    }

    pasteFromClipboard(){

        document.addEventListener("paste", e=>{

            let text = e.clipboardData.getData("Text");

            this.displayCalc = parseFloat(text);

            console.log(text);
        });

    }

    copyToClipboard(){

        let input = document.createElement("input");

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    initialize() {
        this.setDisplayDateTime();
        //execute a cada x milisegundos
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        /*
        //executa uma vez após x milisegundos
        setTimeout(()=>{
            //para setInterval
            clearInterval(interval);
        }, 10000);
        */

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll(".btn-ac").forEach(btn=>{

            btn.addEventListener("dblclick", e=>{

                this.toggleAudio()

            });

        });
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }

    }



    initKeyboard(){
        
        document.addEventListener("keyup", e=>{

            this.playAudio();

            switch(e.key) {
                case "Escape":
                    this.clearAll();    
                    break;
                case "":
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;

                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break;
                
                case "c":
                    if(e.ctrlKey) this.copyToClipboard();
                    break
    
            }
        });

    }

    //poderia ser feito com parametros rest
    addEventListenerAll(element, events, fn){
        //split = transforma string em array
        events.split(" ").forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){

        this._operation = [];
        this._lastNumber = "";
        this._lastOperation = "";
        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    isOperator(value){

        return (["+", "-", "*", "%", "/"].indexOf(value) > - 1);

    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3) {    

            this.calc();
            
        }

    }

    getResult(){
        try{
            //join = contrario do split
            return eval(this._operation.join(""));
        }catch(e){
            console.log(e);
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
    }

    calc(){

        let last = "";
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }

        else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if(last == "%") {

            result /= 100;
            this._operation = [result];

        }
        else {

            this._operation = [result];

            if(last) this._operation.push(last);

        }
        console.log(this._operation);
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1; i>=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }

        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        //se é vazio
        if(!lastNumber) lastNumber = 0;

        if(lastNumber == "30"){
            this.displayCalc = "AMOEDO2022";
        }

        else {
            this.displayCalc = lastNumber;
        }    

    }

    addOperation(value){

        //console.log("A", value, isNaN(this.getLastOperation()));

        //se ultimo botão pressionado não for numero
        if(isNaN(this.getLastOperation())) {
            //se botão pressionado agora é um operador
            if(this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value);
                this.displayOperation();

            }
            //se botão pressionado agora é um numero
            else {
                
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }
        //se ultimo botão pressionado for numero
        else {

            //se o botão pressionado é um operador
            if(this.isOperator(value)) {
                this.pushOperation(value);
                this.displayOperation();
            }
            else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }

        console.log(this._operation);

    }

    setError(){

        this.displayCalc = "Error";

    }

    addDot(){

        let lastOperation = this.getLastOperation();

        console.log("typeof", typeof lastOperation);

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > - 1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        }
        else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){

        this.playAudio();

        switch(value) {
            case "ac":
                this.clearAll();    
                break;
            case "ce":
                this.clearEntry();
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot();
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                blur;

        }

    }

    initButtonEvents(){
        //> = filhos
        //pegue todas as tags g que são filhas de button
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn,index)=>{
            //e = detalhes sobre evento
            this.addEventListenerAll(btn, "click drag", e=>{            
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });
 
    }

    setDisplayDateTime(){
        /*
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        */
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this.timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayOperation(){
        return this._operationEl.innerHTML;
    }

    displayOperation(){
        if(!this._operationEl){
            this._operationEl.innerHTML = "";
        }
        return this._operationEl.innerHTML = this.getLastItem();
    }

    get displayCalc(){   
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value; 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }

}