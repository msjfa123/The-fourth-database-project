const groups = require("../database/groups");

class groupRepository{
    async createGroup(group,detail){
        await groups.create(
            {
                groups:group,
                details:detail
            }
        )
    }

}

module.exports = groupRepository ;