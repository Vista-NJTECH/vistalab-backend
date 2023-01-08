const {checkPermission} = require("../utils/user_utils")
exports.getPreview = async (req, res) => {
    const a = await checkPermission(1, "all")
    console.log(a)
    return a
}