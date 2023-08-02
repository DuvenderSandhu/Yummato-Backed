const express= require('express')
const encrypt= new require('encryptjs')
const mongoose = require('mongoose');
const connectToMongo = require('./Middlewares/connectToMongo')
const FoodSchema =require('./Schemas/FoodSchema')
const Food= mongoose.model('Food',FoodSchema)
const ShopSchema =require('./Schemas/ShopSchema')
const Shop= mongoose.model('Shop',ShopSchema)
const jwt= require('jsonwebtoken')
const app = express()

app.use(express.json());

app.get('/', async (req, res) => {
    res.send("token")
});

app.post('/partner/shop',connectToMongo, async (req, res) => {
    function genShopId() {
        let shopid="YUM";
        if(req.body.pincode.length===6){
            let pinid= req.body.pincode.substring(1, req.body.pincode.length)
            shopid=shopid+pinid+parseInt(Math.random()*10000)
            
        }
        return shopid
    }
    let i=0;
    while (i<=1000){
        let shopid= genShopId()
        let result= await Shop.find({shopID:shopid})
        if(result.length===0){
            res.json(shopid)
            break;
        }
    }
    
})

app.post("/partner/register", connectToMongo,async(req, res)=>{
    try{
    let result= await Shop.create({shopID:req.body.shopID,shopName:req.body.shopName,ownerName:req.body.ownerName,images:req.body.images,GSTIN:req.body.GSTIN,shopDesc:req.body.shopDesc,address:req.body.address,mobile:req.body.mobile,password:encrypt.encrypt(req.body.password,"SECRET_KEY",256),type:req.body.type})
    res.send(result)
    }
    catch{
        res.send("Couldn't Register Your Shop Maybe Duplicate Value is given")
    }
    
})

app.post('/partner/login',connectToMongo,async (req,res) =>{
    try{
        let user= await Shop.find({shopID:req.body.shopID}).select("-password")
        if(user.length!=0){
            let user= await Shop.find({shopID:req.body.shopID})
            if(req.body.password===encrypt.decrypt(user[0].password,"SECRET_KEY",256)){
            let token= await jwt.sign({user:user[0].shopID},"SECRET_KEY")

            res.send(token)
        }
        else{
            res.send("Invalid username and password")
        }
    }
        else{
            res.send("Invalid username and password")
        }

    }
    catch{
        res.send("Couldn't Login Your Account")
    }
})

app.post("/partner/products",connectToMongo,async (req,res) =>{
try{
    let result=jwt.verify(req.body.token,"SECRET_KEY")
    if(result){
        let food= await Food.find({shopID:result.user}).select("-password")
        res.send(food)
    }
}
catch{
    res.redirect('/partner/login')
}

})


app.get('/orders',connectToMongo,async (req, res) => {
    let items= await Food.find()
    res.send(items)
})

app.post('/writeorders',connectToMongo,async (req, res) => {

try{
    let result=await jwt.verify(req.body.token,"SECRET_KEY")
    if(result.user){
        console.log(result)
    let user= await Food.create({shopID:result.user,itemsName:req.body.itemsName,type:req.body.type,price:req.body.price,quantity:req.body.quantity,ItemDesc: req.body.ItemDesc,images: req.body.images})
    if(user.length!=0){
        res.send("Item Added Successfully ")
    }
}}
catch{
    res.send("Could not Save Your Details! Please try again or Duplicate Item Name")
}
    

})
app.get('/orders/:shop',connectToMongo,async (req,res)=>{

    try{
        let result= await Shop.find({$and:[{shopID:req.params.shop},{PhyVerification:true}]})
        if(result.length!=0){
            let item= await Food.find()
        if(item.length!=0){
            res.send(item)
        }
        else{
            res.send("Shop is not Available! Please try again.")
        }
    }
    else{
        res.send("Shop is Not Available! Please try again")
    }
}
    catch{
        res.send("Invalid Food ID")

    }
})

app.post("/orders",connectToMongo,async (req,res) =>{
    let list= await Food.find()
    // TODO: Change Preferences according to Time
    //  TODO: Like Morning Breakfast
    // TODO:  Afternoon Lunch and Tea, Snacks, Food
    //  TODO:  Evening Tea, Snaks
    // TODO:  Night Food, Fast Food
        res.send(list)
})

app.post("/cart",connectToMongo,async (req,res) =>{
        res.send("TODO: Cart")
})

app.get('/login',async (req,res)=>{
res.send("Login ")
})

app.listen(80,()=>{
    console.log("Listeing on port "+80);
})