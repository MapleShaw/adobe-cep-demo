// function openDocument() {
//     var fileRef = new File("~/Downloads/gitflow001.jpg");
//     var docRef = app.open(fileRef);
// }

function psActionPlugin () {}

psActionPlugin.prototype = {
  testScript: function () {
    alert('I am a script and I work');
  }
}

var psAction = new psActionPlugin()


// function initApp () {
//   // 多个jsx后台程序入口
//   $.evalFile('./action.jsx')
//   psAction = new psActionPlugin()
// }

// initApp()

function test () {
    alert('I am a script and I work');
}