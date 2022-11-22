const fs = require('fs');
const db = require('../../models');
const fr = require('filereader');
const uploadMultipleImages = require('../../middlewares/upload');
const ProductImages = db.productImages;

//need test this function
const convertUrl = (blob) => {
  return btoa(new Uint8Array(blob).reduce(
    function (data, byte){
      return data + String.fromCharCode(byte);
    }, ''
  ))
}

exports.uploadImages = async (req, res) => {
  try {
    await uploadMultipleImages (req, res);
    console.log(req.files);
    console.log(req.file);
    if (req.files === 0) {
      return res.send('You must select a file.')
    }
    req.files.forEach((item, i) => {
      ProductImages.create({
        type: item.mimetype,
        name: item.originalname,
        data: fs.readFileSync(
          __basedir + '/resources/static/assets/uploads/' + item.filename
        )
      }).then((result) => {
        fs.writeFileSync(
          __basedir + '/resources/static/assets/tmp/' + result.name,
          result.data
        );
        console.log('result ne ' + result.id);
      });
    });
    return res.send('File has been uploaded');

    // ProductImages.create({
    //   type: req.file.mimetype,
    //   name: req.file.originalname,
    //   data: fs.readFileSync(
    //     __basedir + '/resources/static/assets/uploads/' + req.file.filename
    //   )
    // }).then((result) => {
    //   fs.writeFileSync(
    //     __basedir + '/resources/static/assets/tmp/' + result.name,
    //     result.data
    //   );
    //   console.log(result);
    //   return res.send('File has been uploaded');
    // });
  }catch(e){
    console.log(e);
    return res.send(`Error while trying uploading file ${e}`)
  }
}

exports.findById = (req, res) => {
  const id = req.params.id;
  ProductImages.findByPk(id).then((result) => {
    if (result) {
      let alt = result.name;
      let url = convertUrl(result.data);
      res.send({url, alt});
    } else {
      res.status(404).send({
        message: `cant find id ${id}`
      })
    }
  }).catch((err) => {
    res.status(500).send({
      message: `Error while retrieving data from id ${id}, ${err}`
    })
  });
}

exports.findAll = (req, res) => {
  ProductImages.findAll().then((result) => {
    let imagesInfo = [];
    result.map((item) => {
      let alt = item.name;
      let url = convertUrl(item.data);
    });
    imagesInfo.push({alt, url});
    res.send(imagesInfo);
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occur while retrieving images, please check the logs'
    })
  });
}
