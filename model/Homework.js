const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HomeworkSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    uploadDate: {
        type: Date
    },
    lastDate: {
        type: Date
    },
    hide: {
        type: Boolean,
        default: false
    },
    document:[{
        path: {type: String},
        name: {type: String}
    }],
    downloader: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        downloadDate: {
            type: Date
        },
        done: {
            type: Date
        }
      }]
});

const Homework = mongoose.model("Homework",HomeworkSchema);

module.exports = Homework;