twitterbadge = function(){
  var config = {
    countDefault:1,
    badgeID:'twitterbadge',
    userID:'twitterbadgeuser',
    tweetsID:'twitterbadgetweets',
    userinfo:'userinfo',
    stylesmatch:/skin-(\w+)/,
    amountmatch:/amount-(\d+)/,
    styles:{
      'grey':'twitterbadge.css',
      'blue':'twitterbadgeblue.css'
    }
  };
  var badge;
  function init(){
    badge = document.getElementById(config.badgeID);
    head = document.getElementsByTagName('head')[0];
    if(badge){
      link = badge.getElementsByTagName('a')[0];
      if(link){
        classdata = badge.className;
        var amount = config.amountmatch.exec(classdata);
        var amount = amount ? amount[1] : config.countDefault;
        var skin = config.stylesmatch.exec(classdata);
        var name = link.href.split('/');
        var url = 'http://twitter.com/statuses/user_timeline/' +
                      name[name.length-1] + '.json?callback=' +
                      'twitterbadge.show&count=' + amount;
        if(skin && skin[1]){
          addSkin(skin[1]);
        }
        addData(url);
      }
    }
  }
  function addSkin(skin){
    var style = document.createElement('link');
    style.setAttribute('rel','stylesheet');
    style.setAttribute('type','text/css');
    style.setAttribute('href',config.styles[skin]);
    document.getElementsByTagName('head')[0].insertBefore(style,head.firstChild);
  }
  function addData(url){
    var script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  function addUser(set){
    var user = document.createElement('p');
    user.id = config.userID;
    var img = document.createElement('img');
    img.src = set.user.profile_image_url;
    img.alt = set.user.name;
    user.appendChild(img);
    var ul = document.createElement('ul');
    var data = ['screen_name','name','location'];
    for(var i=0;data[i];i++){
      if(set.user[data[i]]){
        var li = document.createElement('span');
        li.appendChild(document.createTextNode(set.user[data[i]]));
        ul.appendChild(span);
      };
    };
    user.appendChild(ul);
    badge.appendChild(user);
  }
  function show(result){
    if(badge.className.indexOf(config.userinfo) != -1){
      addUser(result[0]);
    }
    var tweets = document.createElement('ul');
    tweets.id = config.tweetsID;
    for(var i=0,j=result.length;i<j;i++){
      var username = result[i].user.screen_name;
      var li = document.createElement('span');
      var span = document.createElement('span');
      span.innerHTML = result[i].text+' ';
      li.appendChild(span);
      var link = document.createElement('a');
      link.setAttribute('href','http://twitter.com/' + username + 
                               '/statuses/'+result[i].id);
      link.appendChild(document.createTextNode(relative_time(result[i].created_at)));
      li.appendChild(link);
      tweets.appendChild(li);
    }
    badge.appendChild(tweets);
  };
  function relative_time(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);
    if (delta < 60) {
      return 'less than a minute ago';
    } else if(delta < 120) {
      return 'about a minute ago';
    } else if(delta < (60*60)) {
      return (parseInt(delta / 60)).toString() + ' minutes ago';
    } else if(delta < (120*60)) {
      return 'about an hour ago';
    } else if(delta < (24*60*60)) {
      return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      return '1 day ago';
    } else {
      return (parseInt(delta / 86400)).toString() + ' days ago';
    }
  }
  return {
    show:show,
    init:init
  };
}();
twitterbadge.init();
