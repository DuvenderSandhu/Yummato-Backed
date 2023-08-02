const mongoose=require('mongoose');
const { Schema } = mongoose;

const FoodSchema= new Schema({
    shopID:String,
    itemsName:String,
    type:Array,
    price:Number,
    quantity:Number,
    ItemDesc: String,
    images: Array,
})
module.exports = FoodSchema
// let obj={shopID:req.body.shopID,itemsName:req.body.itemsName,type:req.body.type,price:req.body.price,quantity:req.body.quantity,shopID:req.body.shopID,ItemDesc: req.body.ItemDesc,images: req.body.images}