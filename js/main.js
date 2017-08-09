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

//for like refreshing
var idOfFirstKotoAfterPageLoaded = '';
var currentLikeStatus = false;
var pubBtn = document.getElementById('publishBtn');
pubBtn.addEventListener('click', publishKoto);
var likeBtn = document.getElementById('likeBtn');
likeBtn.addEventListener('click', switchLike);


//Fetch data on leancloud
var query = new AV.Query('Koto');
query.descending('createdAt');
query.first().then(function (data) {
  idOfFirstKotoAfterPageLoaded = data.id;
}, function (error) {});

var currentKoto = document.getElementById('currentKoto');
var publishedTime = document.getElementById('publishedTime');
var likeNum = document.getElementById('likeNum');
function fetchNewKoto() {
  console.log('fetching...');
  var query = new AV.Query('Koto');
  query.descending('createdAt');
  query.first().then(function (data) {
    console.log(data.id);
    if(data.id != idOfFirstKotoAfterPageLoaded){
      currentLikeStatus = false;
      likeBtn.src = 'img/like.png';
    }
    query.get(data.id).then(function (latestKoto) {
      var content = latestKoto.get('content');
      var createdAt = latestKoto.createdAt;
      var likes = latestKoto.get('likes');
      console.log(content, createdAt, likes);
      currentKoto.innerHTML = content
      publishedTime.innerHTML = createdAt;
      likeNum.innerHTML = likes;
        console.log('fetched');
    }, function (error) {
      console.error('failed to load currentKoto');
    });
  }, function (error) {
    console.error('failed to make query');
  });
}

var autoFetch = setInterval(fetchNewKoto, 5000);

//publish and like
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
    currentKoto.innerHTML = kotoContent;
    console.log('Koto published!');
  }else if(kotoContent == ''){
    alert('Your Koto was empty');
  }else{
    console.log('Koto is cancelled');
  }
}

//like management
var likes = 0;
function switchLike() {
  var query = new AV.Query('Koto');
  query.descending('createdAt');
  query.first().then(function (data) {
    query.get(data.id).then(function (latestKoto) {
      likes = latestKoto.get('likes');

      if(currentLikeStatus === true){
        likeBtn.src = 'img/like.png';
        likes --;
        likeNum.innerHTML = likes;
        latestKoto.set('likes', likes);
        latestKoto.save();
        currentLikeStatus = false;
      }else if(currentLikeStatus === false){
        likeBtn.src = 'img/liked.png';
        likes ++;
        likeNum.innerHTML = likes;
        latestKoto.set('likes', likes);
        latestKoto.save();
        currentLikeStatus = true;
      }else{
        alert('Sorry, please try reloading the page');
        console.error(currentLikeStatus);
      }

    }, function (error) {});
  }, function (error) {});
}
