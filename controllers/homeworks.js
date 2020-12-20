const Homework = require("../model/Homework");
const User = require("../model/User");
const HomeworkFactory = require("../factories/homework");
const UserFactory = require('../factories/user');
const zip = require("express-zip");
const path = require('path');
const DateConvert = require("../helpers/dateConvert");

module.exports = {
    getHomeworksPage: async (req, res, next) => {
      let docs = await HomeworkFactory.getAllByDownloaderWithoutHide(req.user._id);
      let complatedDocs = await HomeworkFactory.getAllByDownloaderComplateWithoutHide(req.user._id);
      let homeworks = [];
      let complatedHomeworks = [];
      for(i = 0; i<docs.length; i++){
        let doc = {
          _id: docs[i]._id,
          name: docs[i].name,
          description: docs[i].description,
          uploadDate: DateConvert.dateDDMMYYYYConvertForTheme(docs[i].uploadDate),
          lastDate: DateConvert.dateDDMMYYYYConvertForTheme(docs[i].lastDate),
          uploader: docs[i].uploader.toJSON(),
          document: docs[i].document.map(part=>part.toJSON()),
          downloader: docs[i].downloader.map(part=>part.toJSON())
        }
        homeworks.push(doc);
      }
      for(i = 0; i<complatedDocs.length; i++){
        let doc = {
          _id: complatedDocs[i]._id,
          name: complatedDocs[i].name,
          description: complatedDocs[i].description,
          uploadDate: DateConvert.dateDDMMYYYYConvertForTheme(complatedDocs[i].uploadDate),
          lastDate: DateConvert.dateDDMMYYYYConvertForTheme(complatedDocs[i].lastDate),
          uploader: complatedDocs[i].uploader.toJSON(),
          document: complatedDocs[i].document.map(part=>part.toJSON()),
          downloader: complatedDocs[i].downloader.map(part=>{
            let rslt = {};
            rslt.user = part.user;
            rslt.downloadDate = DateConvert.dateDDMMYYYYConvertForTheme(part.downloadDate);
            rslt.done =  DateConvert.dateDDMMYYYYConvertForTheme(part.done);
            return rslt;
          })
        }
        complatedHomeworks.push(doc);
      }
      res.render("pages/homeworks",{homeworks,complatedHomeworks})
    },
    downloadDocumentHomework: async (req, res, next) => {
      const publicDirname =  path.join(__dirname, '../public')
      let homework = await HomeworkFactory.getOneWithDoc(req.params.id);
      if(homework.document.length>1){
        let documents = homework.document.map(d => {
          return {path: publicDirname+d.path,name: d.name}
        });
        res.zip(documents,homework.name+'.zip',(err, bytesZipped)=>{
          if(err) throw err;
          else{
            if(req.user.type != 0){
              HomeworkFactory.addDownloader(req.user._id, req.params.id, (message)=>{
                /// Öğretmene bildirim hazırlanacak
              })
            }
          }
        });
      }
      else{
        res.download(publicDirname+homework.document[0].path, homework.document[0].name,(err)=>{
          if(err) throw err;
          else{
            if(req.user.type != 0){
              HomeworkFactory.addDownloader(req.user._id, req.params.id, (message)=>{
                /// Öğretmene bildirim hazırlanacak
              })
            }
          }
        })
      }
    },
    completeHomework: async (req, res, next) => {
      console.log(req.params.id);
      HomeworkFactory.completeHomework(req.user._id,req.params.id,(err,message,data)=>{
        if(err) {

        }
        else{

        }
        res.redirect('/homeworks');
      })
    }
}