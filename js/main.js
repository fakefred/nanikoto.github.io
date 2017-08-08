//status check
console.log('main.js is running');

//Leancloud initialization
var APP_ID = 'VaELFg7Ij0guHpKxBqxTjN1J-gzGzoHsz';
var APP_KEY = 'uE30rQ8zOLVL0UAFrpo0kVux';
var AV = require('leancloud-storage');

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var currentKoto = document.getElementById('currentKoto');
var publishedTime = document.getElementById('publishedTime');

function fetchNewKoto() {
  console.log('fetching...');
  var query = new AV.Query('Koto');
  query.descending('createdAt');
  query.first().then(function (data) {
    console.log(data.id);
    query.get(data.id).then(function (latestKoto) {
      var content = latestKoto.get('content');
      var createdAt = latestKoto.createdAt;
      console.log(content);
      currentKoto.innerHTML = content
      publishedTime.innerHTML = createdAt;
    }, function (error) {
      console.error('failed to load currentKoto');
    });
  }, function (error) {
    console.error('failed to make query');
  });
  console.log('fetched');
}

var autoFetch = setInterval(fetchNewKoto, 5000);


var pubBtn = document.getElementById('publish');
pubBtn.addEventListener('click', publishKoto);

function publishKoto() {
  var kotoContent = prompt('Nanikoto?', '');
  //console.info(kotoContent);
  if(kotoContent != '' && kotoContent != null){
    console.log('trying to publish koto');
    //new class
    var NewKoto = AV.Object.extend('Koto');
    //new Object
    var newKoto = new NewKoto();
    //set properties
    console.log(kotoContent);
    newKoto.set('content', kotoContent);
    //save to Leancloud
    newKoto.save();
    console.log('Koto published!');
  }else if(kotoContent == ''){
    alert('Your Koto was empty');
  }else{
    console.log('Koto is cancelled');
  }
}
