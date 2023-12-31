
exports.gethomePage = (request, response, next) => {
    response.sendFile('login.html', { root: 'views' });
}
exports.geterrorPage = (request,response,next) =>{
    response.sendFile('404.html',{root:'views'});
}
