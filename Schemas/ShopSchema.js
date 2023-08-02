const mongoose=require('mongoose');
const { Schema } = mongoose;

const ShopSchema= new Schema({
    shopID:{
        type:String,
        unique:true
    },
    shopName:String,
    ownerName:String,
    images:Array,
    GSTIN: {
        type:String,
        unique:true
    },
    shopDesc: String,
    address: {
        type:String,
        unique:true
    },
    mobile:String,
    password:String,
    type:String,
    PhyVerification:{
        type:Boolean,
        default: false
    }
})
module.exports = ShopSchema
// let obj={shopID:req.body.shopID,shopName:req.body.shopName,ownerName:req.body.ownerName,images:req.body.images,GSTIN:req.body.GSTIN,shopDesc:req.body.shopDesc,address:req.body.address,type:req.body.type}