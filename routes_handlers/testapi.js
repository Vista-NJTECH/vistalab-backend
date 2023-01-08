const {checkPermission, addPermission, deletePermission} = require("../utils/user_utils")

exports.getPreview = async (req, res) => {
    const a = await deletePermission(1, "all")
    return res.send(a)
}