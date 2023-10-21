const {checkPermission, addPermission, deletePermission} = require("../utils/user_utils")
const {GetTimeGap} = require("../utils/project_utils")
exports.getPreview = async (req, res) => {
    const a = await GetTimeGap(1, "admin,test")
    return res.send(a)
}