const User = require("../model/User");
const Homework = require("../model/Homework");
const DateConvert = require("../helpers/dateConvert");
const user = require("./user");
module.exports = {
  getAll: ()=>{
    return Homework.find({}).sort({uploadDate: 'descending'}).populate('uploader').populate('document').populate('downloader');
  },
  getAllBasic: ()=>{
    return Homework.find({}).sort({uploadDate: 'descending'}).populate('uploader');
  },
  getAllWithDocs: ()=>{
    return Homework.find({}).sort({uploadDate: 'descending'}).populate('uploader').populate('document');
  },
  getAllWithDownloader: ()=>{
    return Homework.find({}).sort({uploadDate: 'descending'}).populate('uploader').populate('downloader.user');
  },
  getAllByDownloader: (userId)=>{
    return Homework.find({"downloader": { 
                              $not: {   $elemMatch: {                       
                                "user":userId,
                                "done": {$ne:null},
                              }
                            }
                          }})
                          .sort({uploadDate: 'descending'})
                          .populate('uploader')
                          .populate('document')
                          .populate({
                            path: 'downloader',
                            populate: {
                              path: "user",
                              match:{'_id':  userId} 
                            }
                          });
  },
  getAllByDownloaderComplate: (userId)=>{
    return Homework.find({"downloader": {
                          $elemMatch: {                           
                            "user":userId,
                            "done": {$ne:null}
                          }}})
                          .sort({uploadDate: 'descending'})
                          .populate('uploader')
                          .populate('document')
                          .populate({
                            path: 'downloader',
                            populate: {
                              path: "user",
                              match:{'_id':  userId} 
                            }
                          });
  },
  getOneWithAllData: (id)=> {
    return Homework.findById(id).populate('uploader').populate('document').populate('downloader');
  },
  getOneWithDoc: (id)=> {
    return Homework.findById(id).populate('uploader').populate('document');
  },
  getOneWithDownloader: (id)=> {
    return Homework.findById(id).populate('uploader').populate('download');
  },

  /////////ESKİ SİSTEM////////
  addHomework: async (data,userId,result) => {
    let uploader = await User.findById(userId);

    const newHomework = new Homework({
        name: data.name,
        description: data.description,
        uploadDate: DateConvert.dateNowForMongoDB(),
        lastDate: DateConvert.dateDDMMYYYYConvertForMongoDB(data.lastDate),
        uploader: uploader
    });

    newHomework.save((err,doc) => {
      if(err){
        result("Beklenmeyen bir hata oluştu", null, null);
      }
      
      result(err,"Ödev başarı ile kaydedildi",{
        _id: doc._id,
        name: doc.name,
        description: doc.description,
        uploadDate: DateConvert.dateDDMMYYYYConvertForTheme(doc.uploadDate),
        lastDate: DateConvert.dateDDMMYYYYConvertForTheme(doc.lastDate),
        document: doc.document,
        downloader: doc.downloader,
        __v: 0
      });
    });
  },

  addDocument: async (data,homeworkId,result)=>{
    let homework = await Homework.findById(homeworkId).populate('document');
    homework.document.push(data);
    homework.save((err,doc)=>{
      if(err){
        result("Beklenmeyen bir hata oluştu!",null,null);
      }
      else{
        result(null,"Dosya başarıyla yüklenmiştir.",doc);
      }
    })
  },

  addDownloader: async (userId,homeworkId,result) => {
    let errorMessage = "";
    await Homework.findOne({_id:homeworkId, 'downloader.user':userId}, (err,doc)=>{
      console.log(homeworkId);
      console.log(userId);
      if(!doc){
        Homework.updateOne({_id:homeworkId},
          {$push:{
            downloader: { 
              user: userId,
              downloadDate: DateConvert.dateNowForMongoDB()
            }
          }},(err,doc)=>{
            if(err) throw err;
            else console.log(doc);
          });
        User.updateOne({_id:userId},
          {
            $push:{
              downloadedHomeworks:homeworkId
            }
          })
      }
    })
    result(errorMessage);
  },

  completeHomework: async (userId,downloaderId,result) => {
    Homework.findOne({'downloader._id': downloaderId},(err,doc) => {
      Homework.findOneAndUpdate(
        { "_id": doc._id, "downloader._id": downloaderId },
        { 
            "$set": {
                "downloader.$.done":  DateConvert.dateNowForMongoDB()
            }
        },
        function(err,doc) {
          if(err){
            result("Yeniden deneyiniz bir hata oluştu!",null,null);
          }
          else{
            result(null,"Ödev başarı ile tamamlanmıştır.",doc);
          }
        }
      );
    });
  }
};