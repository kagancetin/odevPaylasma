const ManageDocumentHelper = require("../helpers/manageDocument");
const HomeworkFactory = require("../factories/homework");
const Homework = require("../model/Homework");
const User = require("../model/User");
const DateConvert = require("../helpers/dateConvert");

module.exports = {
  getManageHomeworkPage: async (req, res, next) => {
    let docs = await HomeworkFactory.getAllBasic();
    let homeworks = [];
    for(i = 0; i<docs.length; i++){
      let doc = {
        _id: docs[i]._id,
        name: docs[i].name,
        description: docs[i].description,
        uploadDate: DateConvert.dateDDMMYYYYConvertForTheme(docs[i].uploadDate),
        lastDate: DateConvert.dateDDMMYYYYConvertForTheme(docs[i].lastDate),
        uploader: docs[i].uploader.toJSON()
      }
      homeworks.push(doc);
    }
    res.render("pages/manage/manageHomework",{homeworks})
  },
  getAddHomeworkPage: async (req, res, next) => {
    res.render("pages/manage/addHomework");
  },
  postAddHomework: async (req, res, next) => {
    let data = req.body;
    HomeworkFactory.addHomework(data, req.user._id, (err,message,homework) => {
      if(err){
        res.locals.error = err;
        res.render("pages/manage/addHomework");
      }
      req.flash("success",message);
      res.redirect("/manage/editHomework/"+homework._id);
    })    
  },
  getEditHomeworkPage: async (req, res, next) => {
    let homework = [];
    var doc = await HomeworkFactory.getOneWithAllData(req.params.id);
    homework = {
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      uploadDate: DateConvert.dateDDMMYYYYConvertForTheme(doc.uploadDate),
      lastDate: DateConvert.dateDDMMYYYYConvertForTheme(doc.lastDate),
      uploader: doc.uploader.toJSON(),
      document: doc.document.map(part=>part.toJSON()),
      downloader: doc.downloader.map(part=>part.toJSON())
    };
    console.log(homework)
    res.render("pages/manage/editHomework",{homework});
    /*
    HomeworkFactory.getHomeworkById(req.params.id, (err,homework)=>{
      res.render("pages/manage/editHomework",{homework});
    })*/
  },
  postEditHomework: async (req, res, next) => {
    ////////eksik
    let data = req.body;
    HomeworkFactory.addHomework(data,(result)=>{
      res.render("pages/manage/addHomework",{
        
      });
    })    
  },
  uploadDocumentHomework: async (req, res, next) => {
    ManageDocumentHelper.uploadFile(req,(err,message,result)=>{
      if(err){
        res.locals.error = err;
        res.send({data:false,message:err});
      }
      else{
        HomeworkFactory.addDocument(result,req.params.id,(err,message,result)=>{
          if(err){
            res.locals.error = err;
            res.send({data:false,message:err});
          }
          else{
            res.send({data:result,message});
          }
        })
      }
    });
  },
  
  ///////// ANALYSIS /////////
  getAnalysisUserPage: async (req, res, next) => {
    res.render("pages/manage/analysisUser",{deneme:[{a:1},{a:2},{a:3},{a:4},{a:5},{a:6},{a:7},{a:8}]});
  },
};
