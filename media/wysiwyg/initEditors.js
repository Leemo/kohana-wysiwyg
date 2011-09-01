(function($) {
$().ready(function(){
    $("textarea"+(editor.textAreaClass != "")?"."+editor.textAreaClass :"").each(function(){
        var tArea = $(this), tab;
        if (!$(this).hasClass("no_wysiwyg")){
            var switchCont = $(document.createElement("DIV")).insertBefore(this).addClass("editorsSwitch");
            for(var i=0; i<editor.lang.length; i++){
                tab = $(document.createElement("A")).appendTo(switchCont).text(editor.lang[i]).click(function(){
                    $(this).addClass("active").removeAttr("href").siblings("a").removeClass("active").attr("href","#");
                    if(this.name == "toDesign"){
                        editor.toTextArea();
                        tArea.tinymce().show();
                        $.data(tArea.get(0),"mode","tiny");
                    }
                    if(this.name == "toCode"){
                        tArea.tinymce().hide();
                        tArea.createCM();
                    }
                }); //onclick
                tab.attr("name" , i == 0 ?"toDesign" : "toCode");
                if(i == 0) tab.addClass("active");
                else tab.attr("href", "#");
            }
            tArea.tinymce({
                script_url : '/'+editor.media_dir+'/tiny_mce/tiny_mce.js',
                theme : "advanced",
                skin : "o2k7",
                plugins : "inlinepopups,autolink,lists,pagebreak,style,table,advhr,advimage,advlink,inlinepopups,media,contextmenu,visualchars,nonbreaking,xhtmlxtras,advlist",
                theme_advanced_buttons1 : "undo,redo,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,forecolor,backcolor,formatselect,fontsizeselect,|,sub,sup,|,charmap",
                theme_advanced_buttons2 : "styleselect,pastetext,pasteword,|,bullist,numlist,|,outdent,indent,|,link,unlink,anchor,image,|,visualchars,nonbreaking,hr,pagebreak,|,media,advhr",
                theme_advanced_buttons3 : "tablecontrols,|,removeformat,visualaid,cleanup,code",
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : true,
                dialog_type:"modal"
            });
            $.data(this,"mode","tiny");
        } // if wisywyg enabled
        else tArea.createCM();

    });
}); // (document).ready

$.fn.createCM = function() {
    CodeMirror.defineMode("mustache", function(config, parserConfig) {
        var mustacheOverlay = {
            token: function(stream, state) {
                if (stream.match("{{")) {
                    while ((ch = stream.next()) != null)
                        if (ch == "}" && stream.next() == "}") break;
                    return "mustache";
                }
                while (stream.next() != null && !stream.match("{{", false)) {}
                return null;
            }
        };
        return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mustacheOverlay);
    });
    editor = CodeMirror.fromTextArea(this.get(0), {
        mode: "mustache",
        lineNumbers: true
    });

    var htmlCode = editor.getValue();
    editor.setValue(htmlCode.replace(/></g,">\r\n<"))
    var l = editor.lineCount();
    for(var i=0; i < l ; i++ ) {
        editor.indentLine(i);
    }
    editor.focus();
    $.data(this.get(0),"mode","code");
}

}(jQuery));