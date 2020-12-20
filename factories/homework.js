const User = require("../model/User");
const Homework = require("../model/Homework");
const DateConvert = require("../helpers/dateConvert");
const user = require("./user");
const ManageDocument = require("../helpers/ManageDocument");
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
  getAllByDownloaderWithoutHide: (userId)=>{
    return Homework.find({"downloader": { 
                              $not: {   $elemMatch: {                       
                                "user":userId,
                                "done": {$ne:null},
                              }
                            }
                          },
                          "hide": false})
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
  getAllByDownloaderComplateWithoutHide: (userId)=>{
    return Homework.find({"downloader": {
                          $elemMatch: {                           
                            "user":userId,
                            "done": {$ne:null}
                          }},
                          "hide": false
                        })
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
    return Homework.findById(id).populate('uploader').populate('document').populate('downloader').populate('downloader.user');
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

  updateHomework: async (id,data,result) =>{
    Homework.findOneAndUpdate(
      { "_id": id},
      { 
          "$set": {
              "name": data.name,
              "description": data.description,
              "lastDate": DateConvert.dateDDMMYYYYConvertForMongoDB(data.lastDate)
          }
      },
      function(err,doc) {
        if(err){
          result("Yeniden deneyiniz bir hata oluştu!",null);
        }
        else{
          result(null,"Ödev başarı ile düzenlendi.");
        }
      }
    );
  },

  removeHomework: async (id,result) =>{
    Homework.findByIdAndRemove(id,async (err,doc)=>{
      if(err){
        result("Bir hata oldu. Yöneticinize bildirin.")
        throw err;
      }
      else {
        for(i = 0; i<doc.document.length; i++){
          fileDeleted = await ManageDocument.removeFile(doc.document[i].path);
        }
        if(fileDeleted) result(null,"Ödev Başarıyla silindi");
        else result(null,"Ödev veritabanından başarıyla silinmiştir, ancak dosyalar tamamen silinemedi YÖNETİCİYE BİLDİRİNİZ");
        
      }
    })
  },

  hideHomework: async (id,result) =>{
    await Homework.findOne({"_id": id}, (err,doc)=>{
      let redata = !doc.hide;
        Homework.updateOne({"_id": id},
          { 
            "$set": {
                "hide": redata
            }
        },(err,doc)=>{
          
            if(err){
              throw err;
              result("Yeniden deneyiniz bir hata oluştu!",null);
            }
            else{
              result(null,"Ödev başarı ile düzenlendi.");
            }
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

  removeDocument:async (homeworkId,docId,result)=>{
    await Homework.findByIdAndUpdate(homeworkId,
      {
        '$pull': {
          'document': {'_id':docId}
        }
      },async (err,doc)=>{
        if(err){
          result("Beklenmeyen bir hata oluştu!",null);
        }
        else{
          let fileDeleted = false
          for(i = 0; i<doc.document.length; i++){
            if(doc.document[i]._id == docId){
              fileDeleted = await ManageDocument.removeFile(doc.document[i].path);
            }
          }
          if(fileDeleted) result(null,"Dosya başarıyla silinmiştir.");
          else result(null,"Dosya veritabanından başarıyla silinmiştir, ancak dosya tamamen silinemedi YÖNETİCİYE BİLDİRİNİZ");
        }
      });
  },

  addDownloader: async (userId,homeworkId,result) => {
    let errorMessage = "";
    await Homework.findOne({_id:homeworkId, 'downloader.user':userId}, (err,doc)=>{
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