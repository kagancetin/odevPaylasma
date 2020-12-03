const fs = require('fs'); 
const path = require('path') 
const formidable = require('formidable');

module.exports = {
    uploadFile: (req,result) => {
        const form = new formidable.IncomingForm(); 
        form.parse(req, function(err, fields, files){
            var oldPath = files.file.path; 
            var newPath = path.join(__dirname, '../public/uploads') 
                    + '/'+files.file.name
            var dbPath = "/uploads/" + files.file.name;
            var rawData = fs.readFileSync(oldPath) 
        
            fs.writeFile(newPath, rawData, function(err){ 
                if(err){
                    return result("Dosya Yüklenemedi",null, null)
                } 
                return result(null,"Dosya Başarıyla Yüklendi",{
                    name: files.file.name,
                    path: dbPath
                });
            });
        });
    }
}