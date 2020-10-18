var converter = new showdown.Converter();
var pad = document.getElementById('pad');
var markdownArea = document.getElementById('markdown'); 
var documentsArea = document.getElementById('documentsArea');  
var nameDocumet = document.getElementById('nameDocu'); 
var name = new Date().getMilliseconds();

var convertTextAreaToMarkdown = () => {
    var markdownText = pad.value;
    html = converter.makeHtml(markdownText);
    markdownArea.innerHTML = html;
};

var getDocuments = () =>{
    $.ajax({
        url: "/documents",
        success: (result) => {
            documentsArea.innerHTML = result;
        }
    })
}

var getDocument = (title) =>{
    $.get('/document', {title}, function (data) {
        pad.value = data.text;
        nameDocumet.innerHTML = data.title;
        name = data.title;
        convertTextAreaToMarkdown();

        var elems = document.querySelectorAll(".active");

        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });

        document.getElementById(data.title).classList.add("active"); 
    });
}

var postDocument = () => {
    console.log(name);
    const documet = {
        title: name,
        created: new Date(),
        text: pad.value
    }
    $.ajax({
        url: "/documents",
        type: "POST",
        data: documet,
        success: (result) => {
            console.log(result);
            getDocuments();
        }
    })
}

var deleteDocument = (document) =>{
    console.log(document);
    $.ajax({
        url: "/documents",
        type: "delete",
        data: {document}, 
        success: (result) => {
            console.log(result);
            getDocuments();
        }
    })
}

var newDocument = () =>{
    var d = new Date();
    name = d.getMilliseconds();
    console.log("newDocument",name);
    nameDocumet.innerHTML = name;
    pad.value = "# Nuevo Documento";
    convertTextAreaToMarkdown();
}

$(document).ready(function() {
    pad.addEventListener('input', convertTextAreaToMarkdown);
    convertTextAreaToMarkdown();
    getDocuments();
    newDocument();
});
