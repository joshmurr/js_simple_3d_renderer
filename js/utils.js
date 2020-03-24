// ERRORS -----------------------------------
var userException = function(message){
    this.message = message;
    this.name = "UserException";
}

var THROW_ERROR = function(){
    throw new userException("RANDOM ERROR");
}
// ------------------------------------------

// GLOBAL VARIABLES -------------------------
var smallNum = 0.000000001;
var emptyMat33 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var emptyMat44 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// ------------------------------------------

// CHECKER FUNCTIONS ------------------------
var isZero = function(x){
    return x < smallNum;
}

var areEqual = function(a, b, epsilon=smallNum){
    return (Math.abs(a-b) <= (epsilon*(Math.abs(a)+Math.abs(b)+1)));
}

var checkLength = function(k, l){
    if(k !== l) 
        throw new userException("Trying to copy Matrix of wrong length!");
}

var checkSize = function(_i, s){
    if(_i >= s) 
        throw new userException(`Matrix is of ${s}x${s} shape! Range is [0, ${s-1}].`);
}
// ------------------------------------------

export { userException, smallNum, isZero, areEqual, checkLength, checkSize };
