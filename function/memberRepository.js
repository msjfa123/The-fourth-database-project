const member = require('../database/members');


class memberRepository{
    async getOne(phoneNumber){
     let memeber = await member.findOne({
            phoneNumber:phoneNumber
        })
        return memeber
    }

    async create(name,lastName,phoneNumber,password){
        await member.create({
            name:name,
            lastName:lastName,
            phoneNumber:phoneNumber,
            password:password
        })
    }
}
























module.exports = memberRepository ;
