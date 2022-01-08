exports.ensureAuth = async (req, res, next) => {
	try {
    if (req.user.isAdmin) {
      next()
    } else {
      // console.log(req.user)
      throw new Error('You donot have permission to perform this action!')
    }
  } catch (error) {
    res.json(error.message)
  }
}
