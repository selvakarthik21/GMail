function handleClientLoad(){gapi.client.setApiKey(apiKey),window.setTimeout(checkAuth,1)}function checkAuth(){gapi.auth.authorize({client_id:clientId,scope:scopes,immediate:!0},handleAuthResult)}function handleAuthClick(){return gapi.auth.authorize({client_id:clientId,scope:scopes,immediate:!1},handleAuthResult),!1}function handleAuthResult(e){e&&!e.error?(loadGmailApi(),$("#authorize-button").remove(),$(".table-inbox").removeClass("hidden"),$("#compose-button").removeClass("hidden")):($("#authorize-button").removeClass("hidden"),$("#authorize-button").on("click",function(){handleAuthClick()}))}function loadGmailApi(){gapi.client.load("gmail","v1",listLabels)}function listLabels(){gapi.client.gmail.users.labels.list({userId:userId}).execute(function(e){var t=e.labels;$.each(t,function(e,t){"user"==t.type&&(userLabel[t.id]=t.name)})})}function listMessages(){var e=loadAllMessages;handleClientLoad(),$(".table-inbox tbody").empty();var t=$.trim($("#query").val());if(t.length<1)alert("Please enter the Search query");else{var a=function(s,l){s.execute(function(o){l=o.messages;var d=o.nextPageToken;e(l),d&&(s=gapi.client.gmail.users.messages.list({userId:userId,pageToken:d,q:t}),a(s,l))})},s=gapi.client.gmail.users.messages.list({userId:userId,q:t});a(s,[])}}function loadAllMessages(e){$.each(e,function(e,t){gapi.client.gmail.users.messages.get({userId:"me",id:this.id}).execute(appendMessageRow)})}function appendMessageRow(e){$(".table-inbox tbody").append("<tr>\t\t\t<td>"+getHeader(e.payload.headers,"From")+'</td>\t\t\t<td>\t\t\t<a href="#message-modal-'+e.id+'" data-toggle="modal" id="message-link-'+e.id+'">'+getHeader(e.payload.headers,"Subject")+"</a>\t\t\t</td>\t\t\t<td>"+getHeader(e.payload.headers,"Date")+"</td>\t\t\t</tr>");var t=(""!==getHeader(e.payload.headers,"Reply-to")?getHeader(e.payload.headers,"Reply-to"):getHeader(e.payload.headers,"From")).replace(/\"/g,"&quot;"),a="Re: "+getHeader(e.payload.headers,"Subject").replace(/\"/g,"&quot;");$("body").append('<div class="modal fade" id="message-modal-'+e.id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\t\t\t<div class="modal-dialog modal-lg">\t\t\t<div class="modal-content">\t\t\t<div class="modal-header">\t\t\t<button type="button"\t\t\tclass="close"\t\t\tdata-dismiss="modal"\t\t\taria-label="Close">\t\t\t<span aria-hidden="true">&times;</span></button>\t\t\t<h4 class="modal-title" id="myModalLabel">'+getHeader(e.payload.headers,"Subject")+'</h4>\t\t\t</div>\t\t\t<div class="modal-body">\t\t\t<iframe id="message-iframe-'+e.id+'" srcdoc="<p>Loading...</p>">\t\t\t</iframe>\t\t\t</div>\t\t\t<div class="modal-footer">\t\t\t<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\t\t\t<button type="button" class="btn btn-primary reply-button" data-dismiss="modal" data-toggle="modal" data-target="#reply-modal"\t\t\tonclick="fillInReply(\t\t\t\''+t+"', \t\t\t'"+a+"', \t\t\t'"+getHeader(e.payload.headers,"Message-ID")+"'\t\t\t);\"\t\t\t>Reply</button>\t\t\t</div>\t\t\t</div>\t\t\t</div>\t\t\t</div>"),$("#message-link-"+e.id).on("click",function(){var t=$("#message-iframe-"+e.id)[0].contentWindow.document;$("body",t).html(getBody(e.payload))})}function sendEmail(){return $("#send-button").addClass("disabled"),sendMessage({To:$("#compose-to").val(),Subject:$("#compose-subject").val()},$("#compose-message").val(),composeTidy),!1}function composeTidy(){$("#compose-modal").modal("hide"),$("#compose-to").val(""),$("#compose-subject").val(""),$("#compose-message").val(""),$("#send-button").removeClass("disabled")}function sendReply(){return $("#reply-button").addClass("disabled"),sendMessage({To:$("#reply-to").val(),Subject:$("#reply-subject").val(),"In-Reply-To":$("#reply-message-id").val()},$("#reply-message").val(),replyTidy),!1}function replyTidy(){$("#reply-modal").modal("hide"),$("#reply-message").val(""),$("#reply-button").removeClass("disabled")}function fillInReply(e,t,a){$("#reply-to").val(e),$("#reply-subject").val(t),$("#reply-message-id").val(a)}function sendMessage(e,t,a){var s="";for(var l in e)s+=l+=": "+e[l]+"\r\n";return s+="\r\n"+t,gapi.client.gmail.users.messages.send({userId:userId,resource:{raw:window.btoa(s).replace(/\+/g,"-").replace(/\//g,"_")}}).execute(a)}function getHeader(e,t){var a="";return $.each(e,function(){this.name.toLowerCase()===t.toLowerCase()&&(a=this.value)}),a}function getBody(e){var t="";return t=void 0===e.parts?e.body.data:getHTMLPart(e.parts),t=t.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,""),decodeURIComponent(escape(window.atob(t)))}function getHTMLPart(e){for(var t=0;t<=e.length;t++){if(void 0!==e[t].parts)return getHTMLPart(e[t].parts);if("text/html"===e[t].mimeType)return e[t].body.data}return""}var clientId="118625724860-lf6mgu8bu61npvv9e2a6jp7o3tkars1p.apps.googleusercontent.com",apiKey="AIzaSyCnvRHxn9BKaUyvREdRJgXtBYZ4Cj4BZjw",scopes="https://www.googleapis.com/auth/gmail.modify",userId="me",userLabel={};