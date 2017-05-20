module.exports = function(req,res,next){
	console.log(req.session)
	if(req.session.usuario != null){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

		return next();
	}
	return res.redirect('/');
}