module.exports = {
    /**
    * handles escape characters for input string eg: converts '""' to '\"\"'
    * 
    * @param {String} inputString - input
    * @param {Boolean} [isFormdata] - since formdata requires different kind of
                                        handling for escape characters
    * @returns {String} 
    */
    handleEscape: function (inputString, isFormdata) {
        if (typeof inputString !== 'string') {
            return '';
        }
        return inputString.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
    }
};
