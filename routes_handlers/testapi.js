const {checkPermission, addPermission} = require("../utils/user_utils")

exports.getPreview = async (req, res) => {
    const a = await addPermission(1, "all")
    return res.send(a)
}