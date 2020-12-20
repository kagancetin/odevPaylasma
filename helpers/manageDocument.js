const fs = require('fs'); 
const path = require('path') 
const formidable = require('formidable');

module.exports = {
    uploadFile: (req,result) => {
        const form = new formidable.IncomingForm(); 
        form.parse(req, function(err, fields, files){
            let oldPath = files.file.path; 
            let newPath = path.join(__dirname, '../public/uploads') 
                    + '/'+files.file.name;
            let approvedPath='';
            let dbPath='';
            let dbName='';

            if (fs.existsSync(newPath)) {
                let dateNow = Date.now();
                approvedPath= path.join(__dirname, '../public/uploads') 
                + '/'+ dateNow + "-" + files.file.name;
                dbPath="/uploads/" + dateNow + "-" + files.file.name;
                dbName = dateNow + "-" + files.file.name
            }
            else{
                approvedPath = newPath;
                dbPath = "/uploads/" + files.file.name;
                dbName = files.file.name
            }
            
            
            let rawData = fs.readFileSync(oldPath, "utf-8");
            
            
            fs.writeFile(approvedPath, rawData,{
                encoding: "utf8"
            }, function(err){ 
                if(err){
                    console.log(err);
                    return result("Dosya Yüklenemedi",null, null)
                } 
                return result(null,"Dosya Başarıyla Yüklendi",{
                    name: dbName,
                    path: dbPath
                });
            });
        });
    },
    removeFile: (docPath)=>{
        const fullPath = path.join(__dirname, '../public') + docPath;
        try {
            fs.unlinkSync(fullPath)
            return true;
        } 
        catch(err) {
            console.error(err);
            return false;
        }
    }
}