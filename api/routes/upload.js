const router = require('express').Router()
const fs = require('fs')
const multer = require('multer')

// Storage Declaration for Multer
// @TODO - Take Directory Path through Login Token
var storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./public/uploads/'+req.header('User-Name'))
    },
    filename: (req,file, cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-'+ file.originalname
        cb(null,uniqueSuffix)
    }
})

//Filter for Files to Upload
// @TODO - Take File Type to filter from Request Object
function fileFilter (req,file,cb) {
    
    if(file.originalname.split('.')[1] == 'pdf')
        cb(null, true)
    else
        cb(null, false)
}

const upload = multer({storage: storage, fileFilter: fileFilter})

router.get('/',(req,res)=>{
    return res.json({
        "status": 200,
        "message": "Upload Endpoint Working"
    })
})

// EndPoint to Upload File
router.post('/testUpload',upload.array('files'),(req,res) =>{
    return res.send(req.files); 
})


// Clears the Upload Folder of the Client
// @TODO - Take Directory Path through Login Token
router.delete('/clearFolder',(req,res)=>{
    fs.rmSync('./public/uploads/'+req.header('User-Name'),  { recursive: true, force: true })
    return res.json({
        "status": 200,
        "message": "folder cleared"
    })
})
module.exports = router