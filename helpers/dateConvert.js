module.exports = {
    dateNowForMongoDB: () => {

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        // prints date & time in YYYY-MM-DD format
        return year + "-" + month + "-" + day +"T"+ hour + ":" + min + ":" + sec + ".000Z";
    },

    dateDDMMYYYYConvertForMongoDB: (date) => {
        let cDate = date.split('/');
        return cDate[2] + "-" + cDate[1] + "-" + cDate[0];
    },

    dateDDMMYYYYConvertForTheme: (date_ob) => {
        let date = date_ob.getDate();
        let month = date_ob.getMonth();
        let year = date_ob.getFullYear();
        return date + "/" + month + "/" + year;
    }
}