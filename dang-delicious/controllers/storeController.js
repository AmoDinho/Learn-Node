const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next){
      const isPhoto = file.mimetype.startsWith('image/');
      if(isPhoto){
          next(null,true);
      } else{
          next({message:'That filetype is not allowed!'}, false);
      }
    }
}

exports.homePage = (req, res) =>{
    res.render('index');
};

exports.addStore = (req, res) =>{
    res.render('editStore', {title:'Add Store'});
};

//Image middlerware - Multer
exports.upload = multer(multerOptions).single('photo');

//resize function
exports.resize = async (req, res, next) => {
    //check if there is no new file to resize
    if(!req.file){
        next();//skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    //Now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // Once we have writtern to the file system we keep gooing.
    next();
};

exports.createStore = async (req,res) =>{
   const store = await (new Store(req.body)).save();
   req.flash('success', `Successfully created ${store.name}. care to leave a review?`);
   res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req,res) =>{
    //1. need to query database for list of stores
    const stores = await Store.find();
    res.render('stores', {title:'Stores', stores});
};

exports.editStore = async (req, res) => {
    //1. Find the store given ID
    const store = await Store.findOne({_id: req.params.id});
    //2. Confirm they are owner of store
    //3. Render out the edit form so the user can update store
    res.render('editStore', {title:`Edit ${store.name}`,store});
};

exports.updateStore = async (req, res) =>{
    //set the location data to be a point
    req.body.location.type = 'Point'; 

    //find store
    const store =  await Store.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true, //return new store instead of old one
        runValidators:true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store</a>`);
    //redirect them to store
    res.redirect(`/stores/${store._id}/edit`);
};


exports.getStoreBySlug = async (req, res, next) =>{

     const store = await Store.findOne({ slug: req.params.slug});
     if(!store) return next();
     res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async (req, res) =>{
   const tag = req.params.tag;
   const tagQuery = tag || {$exists:true};

   const tagsPromise =  Store.getTagsList();
   const storesPromie = Store.find({tags:tagQuery});
   const [tags,stores] = await Promise.all([tagsPromise, storesPromie]);
   
    res.render('tag',{tags, title:'Tags', tag,stores});
};