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

//Fetch data on leancloud
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


var pubBtn = document.getElementById('publishBtn');
pubBtn.addEventListener('click', publishKoto);
var lgnBtn = document.getElementById('loginBtn');
lgnBtn.addEventListener('click', logUser);
var likeBtn = document.getElementById('likeBtn');
likeBtn.addEventListener('click', switchLike);

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

var currentUser = '';
var userName = prompt('Choose a username (changing username is not supported now)');
function logUser() {
  //check if this name exists
  var query = new AV.Query('_User');
  var result = query.matches('username', userName);
  var firstQuery = result.first();
  var queryId = firstQuery.id;
  console.log(queryId);
  if(typeof queryId === 'undefined' || queryId === null || queryId === undefined || queryId === ''){
    console.log('no match found');

    var newUser = new AV.User();
    newUser.setUsername(userName);
    newUser.set('phone', phoneNum);
    newUser.signUp();
    currentUser = userName;
    alert('Welcome, ' + currentUser +'!');
  }else{
    console.log(id, userName);
    currentUser = firstQuery.username;
    alert('Welcome back, ' + currentUser + '!');
  }
}

console.log(currentUser);

function switchLike() {

}
