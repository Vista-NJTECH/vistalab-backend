const {checkPermission, addPermission, deletePermission} = require("../utils/user_utils")

exports.getPreview = async (req, res) => {
    const a = await checkPermission(1, "common,doiry")
    return res.send(a)
}