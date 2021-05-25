var elements = document.getElementsByClassName("active");
for(var i=0;i<elements.length;i++){
    elements[i].onclick = function(){
        if(elements3[0].classList.contains("expand")){
            elements3[0].classList.remove("expand");
            elements4[0].classList.remove("f");
        }
        for(var u=0;u<elements.length;u++){
            if(elements[u].classList.contains("bac")){
                elements[u].classList.remove("bac");
            }
            
        }
        this.classList.add("bac");
    }
}
var elements2 = document.getElementsByClassName("fa-bars");
var elements3 = document.getElementsByClassName("nav-links");
var elements4 = document.getElementsByClassName("fmain");
elements2[0].onclick = function(){
    if(elements3[0].classList.contains("expand")){
        elements3[0].classList.remove("expand");
        elements4[0].classList.remove("f");

    }
    else{
        elements3[0].classList.add("expand");
        elements4[0].classList.add("f");
    }
    
}