module.exports = function(req,res,next){
	if(req.session.usuario != null && req.session.usuario.usuario =="admin" && req.session.usuario.senha =="admin" ){

		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		return next();
	}else if(req.session.usuario != null && req.session.usuario.role == 1){

		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		return next();
	}else{
		return res.redirect('/');
	}
}