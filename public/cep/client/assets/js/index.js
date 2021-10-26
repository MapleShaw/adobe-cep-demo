/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: maplexiao
 * @Date: 2021-10-17 17:15:34
 * @LastEditors: maplexiao
 * @LastEditTime: 2021-10-17 17:15:36
 */
/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();
csInterface.addEventListener("your-event-type", (event) => {
  var data = event.data;
  console.log(data);  // output: pass data from here
});

/* 2) Make a reference to your HTML button and add a click handler. */
var openButton = document.querySelector("#open-button");
openButton.addEventListener("click", openDoc);

/* 3) Write a helper function to pass instructions to the ExtendScript side. */
function openDoc() {
  csInterface.evalScript("openDocument()");
}