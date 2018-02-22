module.exports = {
    /**
    * handles escape characters for input string eg: converts '""' to '\"\"'
    * 
    * @param {String} inputString - input
    * @returns {String} 
    */
    handleEscape: function (inputString) {
        if (typeof inputString !== 'string') {
            return '';
        }
        return inputString.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
    }
};
