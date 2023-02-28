const express = require("express");
const bodyparser = require("body-parser");
const jalaali = require("jalaali-js");
const groups = require("./database/groups");
const commodity = require("./database/commodity");
const member = require("./database/members");
const cart = require("./database/cart");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const inventory = require("./database/inventory");
const groupRepository =require('./function/groupRepository');
const memberRepository = require("./function/memberRepository");





const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));







app.post('/grouping',async(req,res,next)=>{
    let{group,details} = req.body

    if(group.length<2){
        return res.status(200).json({Message:"Your group must be more than two"})
    }
    if(details.length<2){
        return res.status(200).json({Message:"Your details must be more than two"})
    }

    await groupRepository.createGroup(group,details)
    return res.status(200).json({Message:"The operation was done"})

})




app.post('/commodity',async(req,res,next)=>{
    let{name,price,number,company,Description,group} = req.body

    if(name.length<2){
        return res.status(200).json({Message:"Your name must be more than two"})
    }
    if(price.length<2){
        return res.status(200).json({Message:"Your price must be more than two"})
    }

    let connect = await groups.findOne({
        where:{groups:group}
    })

    if(!connect){
        return res.status(200).json({Message:"no group"})
    }

    await commodity.create({
        name:name,
        price:price,
        number:number,
        company:company,
        Description:Description,
        groupId:connect.id
    })

 return   res.status(200).json({Message:"registrated"})
})



app.get('/showCommodity/:groupName?',async(req,res,next)=>{
    let group = req.params.groupName

    if(group){
        let findID = await groups.findAll({
            where:{groups:group},
            include:[{
                model:commodity
            }]
        })
        return res.status(200).json({Message:findID})
    }
    let showall = await commodity.findAll({})
    return res.status(200).json({Message:showall})
})



app.get('/showdetails/:getid',async(req,res,next)=>{
    let getid = req.params.getid

    let ProductionDetails = await commodity.findOne({
        where:{id:Number(getid)},
        include:[{
            model:groups
        }]
    })
    if(ProductionDetails){
        return res.status(200).json({Message:ProductionDetails})
    }
    return res.status(200).json({Message:"this id is not exist"})
    
})




//#region hash password
app.get('/ad/:num',async(req,res,next)=>{
let num = req.params.num
//     let hashPassword= await bcrypt.genSalt();
//    let a =  await bcrypt.hash('123',hashPassword)

let a = await bcrypt.hash('123',3)
let b = await bcrypt.compare(num,a)
console.log("444444444444444444444444");
console.log(b);
    console.log("0000000000000000000000")
  
    console.log(a);
})
//#endregion




app.post('/memberregister',async(req,res,next)=>{
    let{name,lastName,phoneNumber,password} = req.body
    if(name.length<3){
        return res.status(200).json({message:"your name must be grather than 3"})
    }
    if(lastName.length<3){
        return res.status(200).json({message:"your lastname must be grather than 3"})
    }
    if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
        return  res.status(200).json({message:"your phoneNumber must be grather than 10 and first item not be 0"})
    }
    if(password.length<4){
        return res.status(200).json({message:"your lastname must be grather than 4"})
    }

    let check = await memberRepository.getOne(phoneNumber)
    if(!check){
        return res.status(200).json({message:"no person"})
    }

    let hashPassword= await bcrypt.hash(password,5);

    await memberRepository.create(name,lastName,phoneNumber,hashPassword)

    return  res.status(200).json({message:"thanks for register"})
})



app.post('/Cart',async(req,res,next)=>{
    let{phoneNumber,Number,ProductionID}=req.body

    if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
        return  res.status(200).json({message:"your phoneNumber must be grather than 10 and first item not be 0"})
    }

    let user = await member.findOne({
        where:{phoneNumber:phoneNumber}
    })
    if(!user){
        return  res.status(200).json({message:"no person"})
    }

    let Production = await commodity.findOne({
        where:{id:ProductionID}
    })
    if(!Production){
        return  res.status(200).json({message:"no production"})
    }
    if(parseInt(Number)>Production.number){
        return res.status(200).json({message:"Not enough available"})
    }

    let search = await cart.findOne({
        where:{
            memberId:user.id,
            commodityId:Production.id
        }
    })
    if(search){
        let newNumber = parseInt(search.Number)+parseInt(Number)
        await cart.update(
            {Number:newNumber},
            {where:{memberId:user.id,
            commodityId:Production.id}}
        )

        return res.status(200).json({message:`${Number} is added`})
    }
    else{
      
        await cart.create({
            Number:Number,
            memberId:user.id,
            commodityId:Production.id
        })
    }
    return res.status(200).json({message:"Added to cart"})

})



app.post('/showcart',async(req,res,next)=>{
    let{phoneNumber,password} = req.body

    let person = await member.findOne({
        where:{phoneNumber:phoneNumber},
        include:[{
            model:cart,
            include:{
                model:commodity,
                include:{
                    model:groups
                }
            }
        }]
    })
    if(!person){
        return res.status(200).json({message:"no person"})
    }
    let checkPassword = await bcrypt.compare(password,person.password)
    if(checkPassword==false){
        return res.status(200).json({message:"password is incorrect"})
    }

    let totalPrice = 0
    for(let x=0;x<user.carts.length;++x){
        let Total = user.carts[x].Number*user.carts[x].commodity.price
        totalPrice+=parseInt(Total)
    }
    
    res.status(200).json({message:user,totalPrice})
})



app.post('/deleteItem',async(req,res,next)=>{
    let{memberId,ProductionId}=req.body
    
    await cart.destroy({
        where:{memberId:memberId,
        commodityId:ProductionId}
    })

    return res.status(200).json({message:"finish"})
})



app.post('/inventory',async(req,res,next)=>{
    let{phoneNumber,password,cash}=req.body

    let person = await member.findOne({
        where:{phoneNumber:phoneNumber}
    })
    if(!person){
        return res.status(200).json({message:"no person"})
    }

    let checkingPassword = await bcrypt.compare(password,person.password)
    if(checkingPassword==false){
        return res.status(200).json({message:"password is incorrect"})
    }

    let searching = await inventory.findOne({
        where:{memberId:person.id}
    })

    if(searching){
        let NewCash = parseInt(searching.cash)+parseInt(cash)
        await inventory.update(
            {cash:NewCash},
            {where:{memberId:person.id}}
        )
    }
    else{
        await inventory.create({
            cash:cash,
            memberId:person.id
        })
    }
    return res.status(200).json({message:"Inventory increased"})
})



app.post('/pay',async(req,res,next)=>{
    let{phoneNumber,password}=req.body
    let user = await member.findOne({
        where:{phoneNumber:phoneNumber},
        include:[{
            model:cart,
            include:{
                model:commodity
            }
        }]
    })
    if(!user){
        return res.status(200).json({message:"no person"})
    }

    let checksPassword = await bcrypt.compare(password,user.password)
    if(checksPassword==false){
        return res.status(200).json({message:"password is incorrect"})
    }

    let totalPrice = 0
    for(let x=0;x<user.carts.length;++x){
        let Total = user.carts[x].Number*user.carts[x].commodity.price
        totalPrice+=parseInt(Total)
    }
    let value = await inventory.findOne({
        where:{memberId:user.id}
    })

    if(value.cash>=totalPrice){
        let changeCash = value.cash - totalPrice
        await inventory.update(
            {cash:changeCash},
            {where:{memberId:user.id}}
        )

        for(let z=0;z<user.carts.length;++z){
            let cp = user.carts[z].commodity.number - user.carts[z].Number
            await commodity.update(
                {number:cp},
                {where:{id:user.carts[z].commodity.id}}
            )
        }
        return res.status(200).json({message:"Thank you for your payment"})
    }

    return res.status(200).json({message:"Not enough money"})


})

 















app.listen(4001);
