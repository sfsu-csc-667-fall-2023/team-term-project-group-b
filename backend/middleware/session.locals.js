const sessionLocals = (request, response, next) =>{
    response.locals.user = request.session.user;

    next();
}

module.exports = {
    sessionLocals,
}