$(document).on('turbolinks:load', function(){
  function buildHTML(message) {

    var img = message.image ? `<img class="lower-message__image" src= "${message.image}">` : "";
    var html = `<div class="message" data-message-id="${message.id}">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                      ${message.date}
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                    ${message.content}
                    </p>
          
                    ${img}
                </div>`
  return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var message = new FormData(this);
    var url = (window.location.href);
    $.ajax({  
      url: url,
      type: 'POST',
      data: message,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.messages').append(html);
      $('#message_content').val('');
      $('form')[0].reset();
      scrollBottom();
    })
    .fail(function(message){
      alert('エラーが発生したためメッセージは送信できませんでした。');
    })
    .always(function(message){
      $('.form__submit').prop('disabled', false);
    })
   })

   function scrollBottom(){
    var target = $('.message').last();
    var position = target.offset().top + $('.messages').scrollTop();
    $('.messages').animate({
      scrollTop: position
    }, 300, 'swing');
  }

  var reloadMessages = function () {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){//今いるページのリンクが/groups/グループID/messagesのパスとマッチすれば以下を実行。
      
      // messageがあるとき
      // var group_id = $(".group").data("group-id");
      var last_message_id
      if ($('.message:last').data("message-id")){
        last_message_id = $('.message:last').data("message-id"); //dataメソッドで.messageにある:last最後のカスタムデータ属性を取得しlast_message_idに代入。
      }else{
        last_message_id = 0
      }



      $.ajax({ //ajax通信で以下のことを行う
        url: "api/messages", //サーバを指定。今回はapi/message_controllerに処理を飛ばす
        type: 'get', //メソッドを指定
        dataType: 'json', //データはjson形式
        data: {last_id: last_message_id} //飛ばすデータは先ほど取得したlast_message_id。またparamsとして渡すためlast_idとする。
      })
      .done(function (messages) { //通信成功したら、controllerから受け取ったデータ（messages)を引数にとって以下のことを行う
        var insertHTML = '';//追加するHTMLの入れ物を作る
        messages.forEach(function (message) {//配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
          insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得
          $('.messages').append(insertHTML);//メッセージを追加
        })
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');//最新のメッセージが一番下に表示されようにスクロールする。
      })
      .fail(function () {
        alert('自動更新に失敗しました');//ダメだったらアラートを出す
      });
    }
  };

   setInterval(reloadMessages, 5000);//5000ミリ秒ごとにreloadMessagesという関数を実行し自動更新を行う。
  })
  
  
  