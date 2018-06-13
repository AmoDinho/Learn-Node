const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) =>{
    res.render('index');
};

exports.addStore = (req, res) =>{
    res.render('editStore', {title:'Add Store'});
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
    //find store
    const store =  await Store.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true, //return new store instead of old one
        runValidators:true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store</a>`);
    //redirect them to store
    res.redirect(`/stores/${store._id}/edit`);
};