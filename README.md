Some Array, Object and Funtion utilities used for the river framework

## Installation

Copy these files in a directory called commonUtils under the modules directory and then include in the list of modules to load


## Use

    var arrayUtils = require('commonUtilsModule').array;

    var found = arrayUtils.find(myArray, function(it) {
        return it.name === 'ted';
    });



