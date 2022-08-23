var g
const req=new XMLHttpRequest()
try{
    req.open('POST', '/test')
    req.addEventListener('load', () => {
        console.log(req.response)
        var n = document.getElementsByClassName('md')
        var g=JSON.parse(req.response)
        for(let i=0; i<n.length; i++){
            n[i].innerHTML=g[i].md
        }
    });
    req.addEventListener('error', () => console.error('XHR error'));
    req.send()
}catch(err){
    console.error(req.status)
}