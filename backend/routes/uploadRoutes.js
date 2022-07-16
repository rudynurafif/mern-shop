import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

// config, initialize storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      // format nama file supaya tidak double (pakai formate date) dan original ext otomatis ditambahkan dot
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

// ekstensi file yang diperbolehkan
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images file only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})


// upload endpoint
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router