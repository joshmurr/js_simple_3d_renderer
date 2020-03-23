export class SimpleTest{
    log = [];
    id = 0;

    constructor(){

    }

    get log(){
        return this.log;
    }

    createLogEntry(message, actual, expected, result){
        let entry = {
            "ID" : this.id++,
            "result" : result,
            "message" : message,
            "expected" : expected,
            "actual" : actual
        };
        this.log.push(entry);
    }


    assert(message, actual, expected){
        if(actual === expected) {
            this.createLogEntry(message, actual, expected, "PASS");
        } else {
            this.createLogEntry(message, actual, expected, "FAIL");
        }
    }


}
