//多选下拉框，可用同时勾选几个选项
/*基础框设置*/
var tzlist = new Array();
var target;

var str_tzdiv = "<div id='tzdiv' style='background:white;z-index:999;position:absolute;border:1px solid BLACK;overflow:auto;display:block;'></div>";
$(document.body).append(str_tzdiv);

var tzdiv = $("#tzdiv");

var a_qd = $("<a/>", {
  text : "[确定]",
  style : "cursor:pointer;padding-top:5px;padding-left:5px;color:blue;display:block;float:left"
});
var a_qx = $("<a/>", {
  text : "[取消]",
  style : "cursor:pointer;padding-top:5px;padding-left:5px;color:blue;display:block"
});
//点击确定按钮
a_qd.click(function () {
  if (target) {
    target.val("");
    var ids = '';
    var names = '';
    tzdiv.find("input:checkbox").each(
      function () {
      if ($(this).attr("checked") == "checked") {
        ids = ids + ',' + $(this).attr('id');
        names = names + ',' + $(this).attr('name');
      }
    });
    target.val(names.replace(/(^,)|(,$)/g, ''));
    target.prev('input').focus();
    target.prev('input').val(ids.replace(/(^,)|(,$)/g, ''));
    tzdiv.hide();
  }
});

//点击取消按钮隐藏tzdiv
a_qx.click(function () {
  if (target) {
    tzdiv.hide();
  }
});

//点击其他区域隐藏tzdiv
$("body").click(function(){
  if (target) {
    tzdiv.hide();
  }
});
//阻止冒泡
function stopBubble(e) {  
if ( e && e.stopPropagation ) 
  e.stopPropagation(); 
else 
  window.event.cancelBubble = true; 
}
tzdiv.click(function(event){
  stopBubble(event);
});

tzdiv.append(a_qd);
tzdiv.append(a_qx);

//给单元格文本框赋予点击事件
$(document).ready(function () {
  var col;
  var sqlObj={};
  var attr="";//属性
  var colname=[];
  var sqlArray=[];

  colname=(window._unitPatasInfo&&_unitPatasInfo._colname)?_unitPatasInfo._colname.split(";"):[];
  sqlArray=(window._unitPatasInfo&&_unitPatasInfo._sqlArray)?_unitPatasInfo._sqlArray.split(";"):[];

  for (var i = 0; i < colname.length; i++) {
    sqlObj[colname[i]]=sqlArray[i];
    attr+="[colname='"+colname[i]+"'],"
  };
  attr=attr.substr(0,attr.length-1);//去除最后的“,”
  if(colname.length>0){
  $(attr).find("input").click(function (event) {//根据属性绑定点击事件
    stopBubble(event);
    col=$(this).parent().attr("colname");
    tzdiv.find('li').remove('li');
    target = $(this);
    var base = this;
    var tzdata={};

    for(var i=0;i<tzlist.length;i++){
      if(tzlist[i]==col){
        tzdata=tzlist[i];
      }
    }
    if (!tzdata.Rows) {
      $.ajax({
        type: "POST",
        url: "SQLWR.ashx",
        data: { StrSql:escape(sqlObj[col]),
                WRBZ:"READ"
        },
        success: function (data) {
          var jdata=$.parseJSON(data);
          var tzjson={};
          tzjson.Rows=[];
          tzjson.Rows=jdata;

          tzjson.col = col;
          tzlist.push(tzjson);
          showtz(tzjson);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          $("#lblMsg").text(textStatus);
        }
      });
    } else {
      showtz(tzdata);
    }

    function showtz(tzlst) {
      tzdiv.find('li').remove('li');
      tzdiv.width($(base).width() + 50);
      tzdiv.height(150);
      var pos = $(base).offset();

      tzdiv.css("left", pos.left);
      tzdiv.css("top", pos.top + $(base).height() + 5);


      $.each(tzlst.Rows, function (index, item) {
        //循环获取数据
        var id = item.ID;
        var name = item.NAME;

        var li = $("<li/>", {
            text : name,
            style : "list-style-type:none;list-style-position:outside"
          });
        var ck = $("<input/>", {
            type : "checkbox",
            id : id,
            name : name
          }).click(function () {});
        li.prepend(ck);
        tzdiv.append(li);
      });
      tzdiv.show();
    }
  });
  }
})